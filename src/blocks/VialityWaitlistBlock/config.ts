import type { Block } from "payload";

export const VialityWaitlist: Block = {
  slug: "vialityWaitlist",
  interfaceName: "VialityWaitlistBlock",
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "Begin your daily reset.",
    },
    {
      name: "body",
      type: "textarea",
      defaultValue:
        "Early access to new formulations, considered notes on modern wellness, and invitations to private events. Nothing more.",
    },
    {
      name: "placeholder",
      type: "text",
      defaultValue: "YOUR EMAIL ADDRESS",
    },
    {
      name: "buttonLabel",
      type: "text",
      defaultValue: "Join Waitlist",
    },
  ],
  labels: {
    plural: "Viality Waitlists",
    singular: "Viality Waitlist",
  },
};
