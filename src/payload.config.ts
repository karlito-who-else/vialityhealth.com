import path from "path";
import { fileURLToPath } from "url";

// import { Pool } from '@neondatabase/serverless';
import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from '@payloadcms/email-resend';
import {
    BoldFeature,
    EXPERIMENTAL_TableFeature,
    IndentFeature,
    ItalicFeature,
    LinkFeature,
    OrderedListFeature,
    UnderlineFeature,
    UnorderedListFeature,
    lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";

import { Benefits } from "@/collections/Benefits";
import { Categories } from "@/collections/Categories";
import { Faqs } from "@/collections/Faqs";
import { Ingredients } from "@/collections/Ingredients";
import { Media } from "@/collections/Media";
import { Pages } from "@/collections/Pages";
import { Principles } from "@/collections/Principles";
import { ShippingInfo } from "@/collections/ShippingInfo";
import { TrustBadges } from "@/collections/TrustBadges";
import { TrustItems } from "@/collections/TrustItems";
import { Users } from "@/collections/Users";
import { About } from "@/globals/About";
import { Footer } from "@/globals/Footer";
import { Header } from "@/globals/Header";
import { Settings } from "@/globals/Settings";

import { plugins } from "./plugins";
import { env } from "./utilities/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ["@/components/BeforeLogin#BeforeLogin"],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ["@/components/BeforeDashboard#BeforeDashboard"],
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Pages,
    Categories,
    Media,
    Principles,
    Faqs,
    Ingredients,
    Benefits,
    TrustItems,
    ShippingInfo,
    TrustBadges,
  ],
  db: postgresAdapter({
    pool: {
      // eslint-disable-next-line node/no-process-env
      connectionString: process.env.DATABASE_URL || "",
    },
    // pool: new Pool({
    //   connectionString: process.env.DATABASE_URL || '',
    // }) as any,
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ["pages"],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ("name" in field && field.name === "url") return false;
              return true;
            });

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: "url",
                type: "text",
                admin: {
                  condition: ({ linkType }) => linkType !== "internal",
                },
                label: ({ t }) => t("fields:enterURL"),
                required: true,
              },
            ];
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ];
    },
  }),
  //email: nodemailerAdapter(),
  email: resendAdapter({
    defaultFromAddress: 'noreply@vialityhealth.com',
    defaultFromName: 'Viality',
    apiKey: env.RESEND_API_KEY || '',
  }),
  endpoints: [],
  globals: [About, Header, Footer, Settings],
  plugins,
  // eslint-disable-next-line node/no-process-env
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
});
