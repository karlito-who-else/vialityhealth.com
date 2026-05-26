import type { Block } from "payload";

import { link } from "@/fields/link";

export const VialityPhilosophy: Block = {
  slug: "vialityPhilosophy",
  interfaceName: "VialityPhilosophyBlock",
  fields: [
    {
      name: "body",
      type: "textarea",
      defaultValue:
        "Modern rituals for internal balance — formulated with precision, designed for consistency, and held to a quieter standard of vitality.",
    },
    link({
      appearances: false,
    }),
  ],
  labels: {
    plural: "Viality Philosophies",
    singular: "Viality Philosophy",
  },
};
