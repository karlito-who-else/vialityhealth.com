import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { confirmTagadaPayOrder } from "@/actions/confirmTagadaPayOrder";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";
import { getPayload } from "payload";
import configPromise from "@payload-config";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function TagadaReturnPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: SearchParams;
}) {
  const searchParams = await searchParamsPromise;

  const checkoutToken = searchParams.checkoutToken as string | undefined;
  const cartId = searchParams.cartId as string | undefined;
  const email = searchParams.email as string | undefined;

  if (!checkoutToken) {
    redirect("/checkout");
  }

  try {
    if (cartId) {
      const payload = await getPayload({ config: configPromise });

      const cart = await payload.findByID({
        collection: "carts",
        id: Number(cartId),
        depth: 2,
      });

      const orderItems = (cart.items || [])
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .filter((item): item is typeof item & { product: NonNullable<typeof item.product> } => item.product != null)
        .map((item) => {
          const productId = typeof item.product === "object" ? item.product.id : (item.product as number);
          return {
            product: productId,
            variant:
              item.variant && typeof item.variant === "object"
                ? item.variant.id
                : (item.variant as number | undefined),
            quantity: item.quantity || 1,
          };
        });

      const { orderID, accessToken } = await confirmTagadaPayOrder({
        checkoutToken,
        items: orderItems,
        customerEmail: email || null,
        amount: cart.subtotal || 0,
      });

      const queryParams = new URLSearchParams();
      if (email) queryParams.set("email", email);
      if (accessToken) queryParams.set("accessToken", accessToken);

      const queryString = queryParams.toString();
      redirect(`/checkout/order-confirmed/${orderID}${queryString ? `?${queryString}` : ""}`);
    }

    redirect("/orders");
  } catch {
    redirect(`/checkout?error=tagada-payment-failed`);
  }
}

export const metadata: Metadata = {
  description: "Completing your TagadaPay checkout.",
  openGraph: mergeOpenGraph({
    title: "Completing checkout",
    url: "/checkout/tagada-return",
  }),
  title: "Completing checkout",
};
