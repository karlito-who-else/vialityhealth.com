import { EcommerceProvider } from "@payloadcms/plugin-ecommerce/client/react";
import { stripeAdapterClient } from "@payloadcms/plugin-ecommerce/payments/stripe";
import React from "react";

import { AuthProvider } from "@/providers/Auth";
import { SonnerProvider } from "@/providers/Sonner";

import { env } from "@/utilities/env";
import { HeaderThemeProvider } from "./HeaderTheme";
import { ThemeProvider } from "./Theme";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          <EcommerceProvider
            enableVariants={true}
            api={{
              cartsFetchQuery: {
                depth: 2,
                populate: {
                  products: {
                    slug: true,
                    title: true,
                    gallery: true,
                    inventory: true,
                    meta: true,
                    featuredImage: true,
                  },
                  variants: {
                    title: true,
                    inventory: true,
                  },
                },
              },
            }}
            paymentMethods={[
              stripeAdapterClient({
                publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
              }),
            ]}
          >
            {children}
          </EcommerceProvider>
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
