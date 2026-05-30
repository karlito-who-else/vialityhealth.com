"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";

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

export async function createBankTransferOrder(data: {
  items: OrderItemInput[];
  shippingAddress: ShippingAddressInput;
  customer?: number | null;
  customerEmail?: string | null;
  amount: number;
}) {
  const payload = await getPayload({ config: configPromise });

  const order = await payload.create({
    collection: "orders",
    data: {
      items: data.items,
      shippingAddress: data.shippingAddress,
      customer: data.customer || undefined,
      customerEmail: data.customerEmail || undefined,
      amount: data.amount,
      currency: "USD",
      status: "processing",
    },
  });

  return {
    orderID: order.id,
    accessToken: (order as any).accessToken || "",
  };
}
