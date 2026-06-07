import type { Block } from "payload";

export const FaqBlock: Block = {
  slug: "faqBlock",
  interfaceName: "FaqBlock",
  fields: [
    {
      name: "heading",
      type: "text",
    },
    {
      name: "body",
      type: "text",
    },
    {
      name: "items",
      type: "relationship",
      relationTo: "faqs",
      hasMany: true,
      label: "FAQs",
    },
  ],
  labels: {
    plural: "FAQ Blocks",
    singular: "FAQ Block",
  },
};
