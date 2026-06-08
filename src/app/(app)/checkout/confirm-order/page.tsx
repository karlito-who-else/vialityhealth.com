import type { Metadata } from "next";

import { ConfirmOrder } from "@/components/checkout/ConfirmOrder";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ConfirmOrderPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: SearchParams;
}) {
  const searchParams = await searchParamsPromise;

  const _paymentIntent = searchParams.paymentId;

  return (
    <div className="container mx-auto min-h-[90vh] flex py-12 px-4">
      <ConfirmOrder />
    </div>
  );
}

export const metadata: Metadata = {
  description: "Confirm order.",
  openGraph: mergeOpenGraph({
    title: "Confirming order",
    url: "/checkout/confirm-order",
  }),
  title: "Confirming order",
};
