import type { Metadata } from "next";
import { Fragment } from "react";

import { CheckoutPage } from "@/components/checkout/CheckoutPage";
import { env } from "@/utilities/env";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

export default async function Checkout() {
  const settings = await getCachedGlobal("settings", 1)();

  const bankTransfer = settings?.bankTransferEnabled
    ? {
        heading: settings.bankTransferHeading,
        note: settings.bankTransferNote,
        bankName: settings.bankName,
        accountName: settings.accountName,
        accountNumber: settings.accountNumber,
        routingNumber: settings.routingNumber,
        swiftCode: settings.swiftCode,
        bankTransferFooter: settings.bankTransferFooter,
      }
    : undefined;

  const tagadaPayEnabled = (settings as any)?.tagadaPayEnabled === true;

  const shippingOptions: { serviceName: string; timeframe: string; cost: number }[] =
    (settings?.shippingOptions ?? [])
      .filter(
        (opt): opt is { serviceName: string; timeframe: string; cost: number } =>
          typeof opt.serviceName === "string" &&
          typeof opt.timeframe === "string" &&
          typeof opt.cost === "number",
      );

  return (
    <div className="container mx-auto min-h-[90vh] flex px-4">
      {!(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || tagadaPayEnabled) && (
        <div>
          <Fragment>
            {"To enable checkout, you must "}
            <a
              href="https://dashboard.stripe.com/test/apikeys"
              rel="noopener noreferrer"
              target="_blank"
            >
              obtain your Stripe API Keys
            </a>
            {" then set them as environment variables. See the "}
            <a
              href="https://github.com/payloadcms/payload/blob/3.x/templates/ecommerce/README.md#stripe"
              rel="noopener noreferrer"
              target="_blank"
            >
              README
            </a>
            {" for more details."}
          </Fragment>
        </div>
      )}

      <h1 className="sr-only">Checkout</h1>

      <CheckoutPage
        bankTransfer={bankTransfer}
        shippingOptions={shippingOptions}
        tagadaPayEnabled={tagadaPayEnabled}
      />
    </div>
  );
}

export const metadata: Metadata = {
  description: "Checkout.",
  openGraph: mergeOpenGraph({
    title: "Checkout",
    url: "/checkout",
  }),
  title: "Checkout",
};
