import type { Block } from "payload";

export const VialityHero: Block = {
  slug: "vialityHero",
  interfaceName: "VialityHeroBlock",
  fields: [
    {
      name: "tagline",
      type: "text",
      defaultValue: "Wellness, refined.",
    },
    {
      name: "title",
      type: "text",
      defaultValue: "viality",
    },
    {
      name: "subtext",
      type: "text",
      defaultValue: "Where science meets ritual.",
    },
    {
      name: "ctaLabel",
      type: "text",
      defaultValue: "Begin the Ritual",
    },
    {
      name: "ctaLink",
      type: "text",
      defaultValue: "/shop",
    },
    {
      name: "secondaryLabel",
      type: "text",
      defaultValue: "Our Philosophy",
    },
    {
      name: "secondaryLink",
      type: "text",
      defaultValue: "/about",
    },
    {
      name: "scrollLabel",
      type: "text",
      defaultValue: "Scroll",
    },
  ],
  labels: {
    plural: "Viality Heroes",
    singular: "Viality Hero",
  },
};
