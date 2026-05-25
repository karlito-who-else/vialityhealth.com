import type { Block } from "payload";

export const AboutHero: Block = {
  slug: "aboutHero",
  interfaceName: "AboutHeroBlock",
  fields: [
    {
      name: "label",
      type: "text",
      defaultValue: "Our Philosophy",
    },
    {
      name: "heading",
      type: "text",
      defaultValue: "Wellness, refined.\nA quieter standard.",
    },
    {
      name: "body",
      type: "textarea",
      defaultValue:
        "Modern rituals for internal balance — for those who understand that how you care for yourself is a reflection of how you live.",
    },
  ],
  labels: {
    plural: "About Heroes",
    singular: "About Hero",
  },
};
