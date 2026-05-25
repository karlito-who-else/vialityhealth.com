import type { Block } from "payload";

export const AboutTrust: Block = {
  slug: "aboutTrust",
  interfaceName: "AboutTrustBlock",
  fields: [
    {
      name: "label",
      type: "text",
      defaultValue: "Our Standards",
    },
    {
      name: "heading",
      type: "text",
      defaultValue: "The science is visible.\nBy design.",
    },
    {
      name: "body",
      type: "textarea",
      defaultValue:
        "We operate with complete openness. Nothing is hidden behind proprietary blends or ambiguous quantities. Every claim we make is verifiable.",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imageLabel",
      type: "text",
      defaultValue: "Third-Party Verified",
    },
    {
      name: "buttonLabel",
      type: "text",
      defaultValue: "Request Certificate of Analysis",
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
    plural: "About Trust Sections",
    singular: "About Trust Section",
  },
};
