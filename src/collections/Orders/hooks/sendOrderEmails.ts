import type { CollectionAfterChangeHook } from "payload";

import { getDesignTokens } from "@/email/getDesignTokens";
import { orderConfirmationTemplate, orderStatusTemplate } from "@/email/templates";
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

  const recipient = order.customerEmail;
  if (!recipient) return;

  let customerName = recipient;
  if (order.customer && typeof order.customer === "object" && "name" in order.customer) {
    customerName = order.customer.name || recipient;
  }

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

  if (operation === "create") {
    try {
      await req.payload.sendEmail({
        to: recipient,
        subject: `Order confirmed - #${order.id}`,
        html: orderConfirmationTemplate(customerName, order.id, items, total, orderURL, tokens),
      });
    } catch (err) {
      req.payload.logger.error({ msg: "Failed to send order confirmation email", err });
    }
    return;
  }

  if (operation === "update" && previousDoc?.status !== order.status) {
    try {
      await req.payload.sendEmail({
        to: recipient,
        subject: `Order #${order.id} is now ${order.status}`,
        html: orderStatusTemplate(customerName, order.id, order.status, orderURL, tokens),
      });
    } catch (err) {
      req.payload.logger.error({ msg: "Failed to send order status email", err });
    }
  }
};
