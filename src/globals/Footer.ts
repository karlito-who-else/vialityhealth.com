import type { GlobalConfig } from "payload";

import { adminOnly } from "@/access/adminOnly";
import { link } from "@/fields/link";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: "brandName",
      type: "text",
      admin: {
        description: "Brand wordmark shown top-left.",
      },
    },
    {
      name: "brandDescription",
      type: "textarea",
      admin: {
        description: "Short tagline below the wordmark.",
      },
    },
    {
      name: "navItems",
      type: "array",
      label: "Explore Links",
      admin: {
        description: "Navigation links in the second column.",
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Connect / Social Links",
      admin: {
        description: "Social and contact links in the third column.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
      maxRows: 6,
    },
    {
      name: "legalLinks",
      type: "array",
      label: "Legal Links",
      admin: {
        description: "Privacy, Terms, etc. shown in the bottom bar.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
      maxRows: 6,
    },
    {
      name: "copyright",
      type: "text",
      admin: {
        description: "Use {year} as a placeholder for the current year.",
      },
    },
    {
      name: "complianceText",
      type: "textarea",
      admin: {
        description: "FDA disclaimer shown at the bottom. Newline-delimited.",
      },
    },
  ],
};
