import type { Block } from "payload";

import { link } from "@/fields/link";

export const VialityTrust: Block = {
  slug: "vialityTrust",
  interfaceName: "VialityTrustBlock",
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "A quieter standard of vitality.",
    },
    {
      name: "body",
      type: "textarea",
      defaultValue:
        "Every formulation is open. Every claim is earned. We believe in complete transparency — not as a selling point, but as the only responsible way to operate.",
    },
    link({
      appearances: false,
    }),
    {
      name: "items",
      type: "relationship",
      relationTo: "trustItems",
      hasMany: true,
      label: "Trust Items",
    },
  ],
  labels: {
    plural: "Viality Trusts",
    singular: "Viality Trust",
  },
};
