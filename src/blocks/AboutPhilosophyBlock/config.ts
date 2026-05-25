import type { Block } from "payload";

export const AboutPhilosophy: Block = {
  slug: "aboutPhilosophy",
  interfaceName: "AboutPhilosophyBlock",
  fields: [
    {
      name: "label",
      type: "text",
      defaultValue: "Brand Philosophy",
    },
    {
      name: "heading",
      type: "text",
      defaultValue: "Where science meets ritual — and neither is allowed to compromise the other.",
    },
    {
      name: "body",
      type: "array",
      label: "Paragraphs",
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
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "imageLabel",
      type: "text",
      defaultValue: "viality — signature formula",
    },
  ],
  labels: {
    plural: "About Philosophies",
    singular: "About Philosophy",
  },
};
