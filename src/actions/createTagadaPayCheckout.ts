"use server";

import { getTagadaClient } from "@/lib/tagada-pay";
import { env } from "@/utilities/env";

type CartItemInput = {
  tagadaPayVariantId: string;
  quantity: number;
};

export async function createTagadaPayCheckout(data: {
  items: CartItemInput[];
  cartId?: number;
  customerEmail?: string;
}) {
  const client = getTagadaClient();

  if (!client) {
    throw new Error("TagadaPay is not configured");
  }

  const { tagada, storeId } = client;

  const serverUrl = env.NEXT_PUBLIC_SERVER_URL || "";

  const returnUrl = new URL(`${serverUrl}/checkout/tagada-return`);
  if (data.cartId) {
    returnUrl.searchParams.set("cartId", String(data.cartId));
  }
  if (data.customerEmail) {
    returnUrl.searchParams.set("email", data.customerEmail);
  }

  const { redirectUrl } = await tagada.checkout.createSession({
    storeId,
    items: data.items.map((item) => ({
      variantId: item.tagadaPayVariantId,
      quantity: item.quantity,
    })),
    returnUrl: returnUrl.toString(),
    ...(data.customerEmail ? { customerEmail: data.customerEmail } : {}),
    includeCheckoutToken: true,
  });

  return { redirectUrl };
}
