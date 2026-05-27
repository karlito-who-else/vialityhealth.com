import { ecommercePlugin } from "@payloadcms/plugin-ecommerce";
import { stripeAdapter } from "@payloadcms/plugin-ecommerce/payments/stripe";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { mcpPlugin } from "@payloadcms/plugin-mcp";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { GenerateTitle, GenerateURL } from "@payloadcms/plugin-seo/types";
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { Plugin } from "payload";

import { adminOnlyFieldAccess } from "@/access/adminOnlyFieldAccess";
import { adminOrPublishedStatus } from "@/access/adminOrPublishedStatus";
import { customerOnlyFieldAccess } from "@/access/customerOnlyFieldAccess";
import { isAdmin } from "@/access/isAdmin";
import { isDocumentOwner } from "@/access/isDocumentOwner";
import { ProductsCollection } from "@/collections/Products";
import { Page, Product } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : "Payload Ecommerce Template";
};

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL();

  return doc?.slug ? `${url}/${doc.slug}` : url;
};

export const plugins: Plugin[] = [
  mcpPlugin({
    collections: {
      // users: {
      //   enabled: true,
      // },
      pages: {
        enabled: true,
      },
      categories: {
        enabled: true,
      },
      media: {
        enabled: true,
      },
      principles: {
        enabled: true,
      },
      faqs: {
        enabled: true,
      },
      ingredients: {
        enabled: true,
      },
      benefits: {
        enabled: true,
      },
      trustItems: {
        enabled: true,
      },
      shippingInfo: {
        enabled: true,
      },
      trustBadges: {
        enabled: true,
      },
      forms: {
        enabled: true,
      },
      "form-submissions": {
        enabled: true,
      },
      addresses: {
        enabled: true,
      },
      variants: {
        enabled: true,
      },
      variantTypes: {
        enabled: true,
      },
      variantOptions: {
        enabled: true,
      },
      products: {
        enabled: true,
      },
      carts: {
        enabled: true,
      },
      orders: {
        enabled: true,
      },
      transactions: {
        enabled: true,
      },
      "payload-mcp-api-keys": {
        enabled: true,
      },
      "payload-kv": {
        enabled: true,
      },
      "payload-locked-documents": {
        enabled: true,
      },
      "payload-preferences": {
        enabled: true,
      },
      "payload-migrations": {
        enabled: true,
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: "Content",
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: "Content",
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ("name" in field && field.name === "confirmationMessage") {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
                  ];
                },
              }),
            };
          }
          return field;
        });
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: "users",
    },
    carts: {
      cartsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        hooks: {
          ...defaultCollection.hooks,
          beforeChange: [
            ({ data, originalDoc, operation }) => {
              if (operation === "update" && !data.currency) {
                data.currency = originalDoc?.currency || "USD";
              }
              if (typeof data.subtotal === "number" && isNaN(data.subtotal)) {
                data.subtotal = 0;
              }
            },
            ...(defaultCollection.hooks?.beforeChange ?? []),
          ],
        },
      }),
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        fields: [
          ...defaultCollection.fields,
          {
            name: "accessToken",
            type: "text",
            unique: true,
            index: true,
            admin: {
              position: "sidebar",
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === "create" || !value) {
                    return crypto.randomUUID();
                  }
                  return value;
                },
              ],
            },
          },
        ],
      }),
    },
    payments: {
      paymentMethods: [
        stripeAdapter({
          // eslint-disable-next-line node/no-process-env
          secretKey: process.env.STRIPE_SECRET_KEY!,
          // eslint-disable-next-line node/no-process-env
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          // eslint-disable-next-line node/no-process-env
          webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
  }),
  vercelBlobStorage({
    enabled: true, // Set to false to disable in local dev if preferred
    collections: {
      media: true, // 'media' matches the slug of your collection above
    },
    // eslint-disable-next-line node/no-process-env
    token: process.env.BLOB_READ_WRITE_TOKEN,
  }),
];
