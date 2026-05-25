import type { CollectionConfig } from "payload";

import { adminOnly } from "@/access/adminOnly";
import { publicAccess } from "@/access/publicAccess";

export const TrustBadges: CollectionConfig = {
  slug: "trustBadges",
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicAccess,
    update: adminOnly,
  },
  admin: {
    group: "Marketing",
    defaultColumns: ["label", "order", "updatedAt"],
    useAsTitle: "label",
  },
  fields: [
    {
      name: "label",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
