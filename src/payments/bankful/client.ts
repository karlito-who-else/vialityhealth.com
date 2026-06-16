import type { PaymentAdapterClient } from "@payloadcms/plugin-ecommerce/types";

export const bankfulAdapterClient = (): PaymentAdapterClient => {
  return {
    name: "bankful",
    confirmOrder: true,
    initiatePayment: true,
    label: "Card",
  };
};
