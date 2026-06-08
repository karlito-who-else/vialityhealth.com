import type { CollectionConfig } from "payload";

import { adminOnly } from "@/access/adminOnly";
import { adminOnlyFieldAccess } from "@/access/adminOnlyFieldAccess";
import { adminOrSelf } from "@/access/adminOrSelf";
import { publicAccess } from "@/access/publicAccess";
import { checkRole } from "@/access/utilities";

import { getDesignTokens } from "@/email/getDesignTokens";
import { passwordResetTemplate } from "@/email/templates";
import { getServerSideURL } from "@/utilities/getURL";

import { ensureFirstUserIsAdmin } from "./hooks/ensureFirstUserIsAdmin";
import { sendAccountCreatedEmail } from "./hooks/sendAccountCreatedEmail";

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    admin: ({ req: { user } }) => checkRole(["admin"], user),
    create: publicAccess,
    delete: adminOnly,
    read: adminOrSelf,
    unlock: adminOnly,
    update: adminOrSelf,
  },
  admin: {
    group: "Users",
    defaultColumns: ["name", "email", "roles"],
    useAsTitle: "name",
  },
  auth: {
    tokenExpiration: 1209600,
    forgotPassword: {
      generateEmailHTML: async (args) => {
        const { user, token, req } = args || {};
        if (!user || !token || !req) return "";
        const url = `${getServerSideURL()}/reset-password?token=${token}`;
        const name = user.name || user.email;
        const tokens = await getDesignTokens({ payload: req.payload, req });
        return passwordResetTemplate(name, url, tokens);
      },
    },
  },
  hooks: {
    afterChange: [sendAccountCreatedEmail],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      access: {
        create: adminOnlyFieldAccess,
        read: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      defaultValue: ["customer"],
      hasMany: true,
      hooks: {
        beforeChange: [ensureFirstUserIsAdmin],
      },
      options: [
        {
          label: "admin",
          value: "admin",
        },
        {
          label: "customer",
          value: "customer",
        },
      ],
    },
    {
      name: "orders",
      type: "join",
      collection: "orders",
      on: "customer",
      admin: {
        allowCreate: false,
        defaultColumns: ["id", "createdAt", "total", "currency", "items"],
      },
    },
    {
      name: "cart",
      type: "join",
      collection: "carts",
      on: "customer",
      admin: {
        allowCreate: false,
        defaultColumns: ["id", "createdAt", "total", "currency", "items"],
      },
    },
    {
      name: "addresses",
      type: "join",
      collection: "addresses",
      on: "customer",
      admin: {
        allowCreate: false,
        defaultColumns: ["id"],
      },
    },
  ],
};
