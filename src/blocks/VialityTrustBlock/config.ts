import type { Block } from "payload";

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
    {
      name: "ctaLabel",
      type: "text",
      defaultValue: "View Lab Reports",
    },
    {
      name: "ctaLink",
      type: "text",
      defaultValue: "/about",
    },
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
