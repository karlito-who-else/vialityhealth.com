"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";

import { getTagadaClient } from "@/lib/tagada-pay";

type OrderItemInput = {
  product: number;
  variant?: number;
  quantity: number;
};

type ShippingAddressInput = {
  title?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
};

type ShippingMethodInput = {
  serviceName: string;
  timeframe: string;
  cost: number;
};

export async function confirmTagadaPayOrder(data: {
  checkoutToken: string;
  items: OrderItemInput[];
  shippingAddress?: ShippingAddressInput | null;
  billingAddress?: ShippingAddressInput | null;
  customer?: number | null;
  customerEmail?: string | null;
  amount: number;
  shippingMethod?: ShippingMethodInput | null;
}) {
  const client = getTagadaClient();

  if (!client) {
    throw new Error("TagadaPay is not configured");
  }

  const { tagada } = client;

  const status = (await tagada.checkout.asyncStatus(data.checkoutToken)) as {
    status?: string;
  };

  if (status?.status !== "completed" && status?.status !== "succeeded") {
    throw new Error("Payment was not successful");
  }

  const payload = await getPayload({ config: configPromise });

  const order = await payload.create({
    collection: "orders",
    data: {
      items: data.items,
      shippingAddress: data.shippingAddress || undefined,
      customer: data.customer || undefined,
      customerEmail: data.customerEmail || undefined,
      amount: data.amount,
      currency: "AUD",
      status: "processing",
      shippingMethod: data.shippingMethod || undefined,
    },
  });

  return {
    orderID: order.id,
    accessToken: (order as any).accessToken || "",
  };
}
