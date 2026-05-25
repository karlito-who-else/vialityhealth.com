import type { GlobalConfig } from "payload";

import { adminOnly } from "@/access/adminOnly";

export const About: GlobalConfig = {
  slug: "about",
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: "heroLabel",
      type: "text",
      defaultValue: "Our Philosophy",
    },
    {
      name: "heroHeading",
      type: "text",
      defaultValue: "Wellness, refined.\nA quieter standard.",
    },
    {
      name: "heroBody",
      type: "textarea",
      defaultValue:
        "Modern rituals for internal balance — for those who understand that how you care for yourself is a reflection of how you live.",
    },
    {
      name: "philosophyLabel",
      type: "text",
      defaultValue: "Brand Philosophy",
    },
    {
      name: "philosophyHeading",
      type: "text",
      defaultValue: "Where science meets ritual — and neither is allowed to compromise the other.",
    },
    {
      name: "philosophyBody",
      type: "array",
      label: "Philosophy Body Paragraphs",
      maxRows: 6,
      fields: [
        {
          name: "paragraph",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "philosophyImageLabel",
      type: "text",
      defaultValue: "viality — signature formula",
    },
    {
      name: "principlesLabel",
      type: "text",
      defaultValue: "What We Stand For",
    },
    {
      name: "principlesHeading",
      type: "text",
      defaultValue: "Three principles.\nNo exceptions.",
    },
    {
      name: "trustLabel",
      type: "text",
      defaultValue: "Our Standards",
    },
    {
      name: "trustHeading",
      type: "text",
      defaultValue: "The science is visible.\nBy design.",
    },
    {
      name: "trustBody",
      type: "textarea",
      defaultValue:
        "We operate with complete openness. Nothing is hidden behind proprietary blends or ambiguous quantities. Every claim we make is verifiable.",
    },
    {
      name: "trustImageLabel",
      type: "text",
      defaultValue: "Third-Party Verified",
    },
    {
      name: "trustButtonLabel",
      type: "text",
      defaultValue: "Request Certificate of Analysis",
    },
    {
      name: "founderLabel",
      type: "text",
      defaultValue: "A Note from the Founders",
    },
    {
      name: "founderQuote",
      type: "textarea",
      defaultValue:
        '"We built viality because we were tired of choosing between what works and what feels worthy of the care we put into ourselves. Modern rituals for internal balance shouldn\'t require compromise. That conviction is built into every decision we make — from the compounds we select to the language we use to describe them."',
    },
    {
      name: "founderSignature",
      type: "text",
      defaultValue: "The viality Team",
    },
    {
      name: "ctaHeading",
      type: "text",
      defaultValue: "Designed for\nconsistency.",
    },
    {
      name: "ctaBody",
      type: "textarea",
      defaultValue:
        "Where science meets ritual. Formulations built to be used daily, for the long term — with complete transparency about everything inside them.",
    },
    {
      name: "ctaShopLabel",
      type: "text",
      defaultValue: "Shop Formulas",
    },
    {
      name: "ctaLabLabel",
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
};
