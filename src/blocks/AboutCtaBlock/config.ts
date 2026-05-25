import type { Block } from "payload";

export const AboutCta: Block = {
  slug: "aboutCta",
  interfaceName: "AboutCtaBlock",
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Designed for\nconsistency.",
    },
    {
      name: "body",
      type: "textarea",
      defaultValue:
        "Where science meets ritual. Formulations built to be used daily, for the long term — with complete transparency about everything inside them.",
    },
    {
      name: "shopLabel",
      type: "text",
      defaultValue: "Shop Formulas",
    },
    {
      name: "shopLink",
      type: "text",
      defaultValue: "/shop",
    },
    {
      name: "labLabel",
      type: "text",
      defaultValue: "View Lab Reports",
    },
    {
      name: "complianceText",
      type: "textarea",
      defaultValue:
        "These statements have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease.",
    },
  ],
  labels: {
    plural: "About CTAs",
    singular: "About CTA",
  },
};
