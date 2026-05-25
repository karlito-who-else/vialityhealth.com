import type { CollectionConfig } from "payload";

import { adminOnly } from "@/access/adminOnly";
import { publicAccess } from "@/access/publicAccess";

export const Benefits: CollectionConfig = {
  slug: "benefits",
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicAccess,
    update: adminOnly,
  },
  admin: {
    group: "Marketing",
    defaultColumns: ["title", "order", "updatedAt"],
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
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
      name: "body",
      type: "textarea",
      required: true,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
