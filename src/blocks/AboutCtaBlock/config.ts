import type { Block } from "payload";

import { link } from "@/fields/link";

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
      name: "links",
      type: "array",
      label: "Links",
      maxRows: 2,
      fields: [
        link({
          appearances: false,
        }),
      ],
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
