import type { CollectionAfterChangeHook } from "payload";

import { getDesignTokens } from "@/email/getDesignTokens";
import type { BankTransferSettings } from "@/email/templates";
import { formatStatus, orderConfirmationTemplate, orderStatusTemplate } from "@/email/templates";
import type { Setting } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";

type OrderItem = {
  product: string | { id: string; title?: string };
  quantity: number;
};

export const sendOrderEmails: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const order = doc;

  let recipient = order.customerEmail;
  let customerName = recipient || "";

  if (!recipient && order.customer) {
    const customerId = typeof order.customer === "object" ? order.customer.id : order.customer;
    try {
      const user = await req.payload.findByID({
        collection: "users",
        id: customerId,
        depth: 0,
      });
      recipient = user?.email;
      customerName = user?.name || recipient || "";
    } catch {
      // user lookup failed
    }
  }

  if (!recipient) return;

  const serverURL = getServerSideURL();
  const orderURL = `${serverURL}/orders/${order.id}?email=${encodeURIComponent(recipient)}&accessToken=${order.accessToken}`;

  const items: { title: string; quantity: number; price: string }[] = (
    order.items || []
  ).map((item: OrderItem) => {
    const productTitle =
      typeof item.product === "object" && "title" in item.product
        ? item.product.title
        : `Product #${typeof item.product === "object" ? item.product.id : item.product}`;
    return {
      title: productTitle,
      quantity: item.quantity || 1,
      price: "",
    };
  });

  const total =
    order.amount != null && order.currency
      ? `${order.currency} ${(order.amount / 100).toFixed(2)}`
      : "";

  const tokens = await getDesignTokens({ payload: req.payload, req });

  const settings = await req.payload.findGlobal({
    slug: "settings",
    depth: 0,
    req,
  }) as Setting;

  const orderHoldMessage = settings?.orderHoldMessage || null;

  const bankTransferSettings: BankTransferSettings | null =
    settings.bankTransferEnabled && (!order.transactions || (order.transactions as unknown[])?.length === 0)
      ? {
          bankTransferHeading: settings.bankTransferHeading,
          bankTransferNote: settings.bankTransferNote,
          bankName: settings.bankName,
          accountName: settings.accountName,
          accountNumber: settings.accountNumber,
          routingNumber: settings.routingNumber,
          swiftCode: settings.swiftCode,
          bankTransferFooter: settings.bankTransferFooter,
        }
      : null;

  if (operation === "create") {
    try {
      await req.payload.sendEmail({
        to: recipient,
        subject: `Order confirmed - #${order.id}`,
        html: orderConfirmationTemplate(
          customerName,
          order.id,
          items,
          total,
          orderURL,
          tokens,
          bankTransferSettings,
          order.amount,
          orderHoldMessage,
        ),
        from: "orders@mail.vialityhealth.com",
        replyTo: "orders@vialityhealth.com",
      });
    } catch (err) {
      req.payload.logger.error({ msg: "Failed to send order confirmation email", err });
    }
    return;
  }

  if (operation === "update" && previousDoc?.status !== order.status) {
    const shippingTrackingUrl = order.shippingTrackingUrl ?? undefined;

    const shippingLabels: { url: string; alt: string }[] = [];
    if (order.shippingLabels?.length) {
      const labelIds: number[] = (order.shippingLabels as (number | { id: number })[]).map(
        (label) => (typeof label === "object" ? label.id : label),
      );
      for (const id of labelIds) {
        try {
          const media = await req.payload.findByID({
            collection: "media",
            id,
            depth: 0,
          });
          if (media?.url) {
            const imageUrl = media.url.startsWith("http")
              ? media.url
              : `${serverURL.replace(/\/+$/, "")}${media.url.startsWith("/") ? media.url : `/${media.url}`}`;
            shippingLabels.push({ url: imageUrl, alt: media.alt || "Shipping label" });
          }
        } catch {
          // media lookup failed
        }
      }
    }

    try {
      await req.payload.sendEmail({
        to: recipient,
        subject: `Order #${order.id} is now ${formatStatus(order.status || "")}`,
        html: orderStatusTemplate(
          customerName,
          order.id,
          formatStatus(order.status || ""),
          orderURL,
          tokens,
          shippingTrackingUrl,
          shippingLabels,
          bankTransferSettings,
          order.amount,
        ),
        from: "orders@mail.vialityhealth.com",
        replyTo: "orders@vialityhealth.com",
      });
    } catch (err) {
      req.payload.logger.error({ msg: "Failed to send order status email", err });
    }
  }
};
