import type { Block } from "payload";

export const AboutPrinciples: Block = {
  slug: "aboutPrinciples",
  interfaceName: "AboutPrinciplesBlock",
  fields: [
    {
      name: "label",
      type: "text",
      defaultValue: "What We Stand For",
    },
    {
      name: "heading",
      type: "text",
      defaultValue: "Three principles.\nNo exceptions.",
    },
    {
      name: "items",
      type: "relationship",
      relationTo: "principles",
      hasMany: true,
      label: "Principles",
    },
  ],
  labels: {
    plural: "About Principles",
    singular: "About Principles",
  },
};
