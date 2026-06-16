import type { PaymentAdapter } from "@payloadcms/plugin-ecommerce/types";
import type { GroupField } from "payload";

import { confirmOrder } from "./confirmOrder";
import { initiatePayment } from "./initiatePayment";

export type BankfulAdapterArgs = {
  label?: string;
};

export const bankfulAdapter = (props?: BankfulAdapterArgs): PaymentAdapter => {
  const label = props?.label || "Bankful";

  const groupField: GroupField = {
    name: "bankful",
    type: "group",
    admin: {
      condition: (data) => data?.["paymentMethod"] === "bankful",
    },
    fields: [
      {
        name: "transactionId",
        type: "text",
        label: "Bankful Transaction ID",
      },
      {
        name: "requestId",
        type: "text",
        label: "Bankful Request ID",
      },
      {
        name: "recordId",
        type: "text",
        label: "Bankful Record ID",
      },
      {
        name: "xtlOrderId",
        type: "text",
        label: "External Order ID",
      },
    ],
  } as GroupField;

  return {
    name: "bankful",
    confirmOrder: confirmOrder(),
    group: groupField,
    initiatePayment: initiatePayment(),
    label,
  };
};
