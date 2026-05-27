import type { Block } from "payload";

import { link } from "@/fields/link";

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
      name: "media",
      type: "array",
      label: "Media",
      maxRows: 2,
      fields: [
        {
          name: "mediaItem",
          type: "upload",
          relationTo: "media",
        },
      ],
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
