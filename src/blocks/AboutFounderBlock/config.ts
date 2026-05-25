import type { Block } from "payload";

export const AboutFounder: Block = {
  slug: "aboutFounder",
  interfaceName: "AboutFounderBlock",
  fields: [
    {
      name: "label",
      type: "text",
      defaultValue: "A Note from the Founders",
    },
    {
      name: "quote",
      type: "textarea",
      defaultValue:
        '"We built viality because we were tired of choosing between what works and what feels worthy of the care we put into ourselves. Modern rituals for internal balance shouldn\'t require compromise. That conviction is built into every decision we make — from the compounds we select to the language we use to describe them."',
    },
    {
      name: "signature",
      type: "text",
      defaultValue: "The viality Team",
    },
  ],
  labels: {
    plural: "About Founder Notes",
    singular: "About Founder Note",
  },
};
