import { ecommercePlugin } from "@payloadcms/plugin-ecommerce";
import { stripeAdapter } from "@payloadcms/plugin-ecommerce/payments/stripe";
import { bankfulAdapter } from "@/payments/bankful";
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
import { sendOrderEmails } from "@/collections/Orders/hooks/sendOrderEmails";
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
    currencies: {
      defaultCurrency: "AUD",
      supportedCurrencies: [
        {
          code: "AUD",
          decimals: 2,
          label: "Australian Dollar",
          symbol: "A$",
          symbolDisplay: "symbol",
        },
      ],
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
                data.currency = originalDoc?.currency || "AUD";
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
        hooks: {
          ...defaultCollection.hooks,
          afterChange: [
            ...(defaultCollection.hooks?.afterChange ?? []),
            sendOrderEmails,
          ],
        },
        fields: [
          ...defaultCollection.fields.map((field) => {
            if ("name" in field && field.name === "status" && field.type === "select") {
              return {
                ...field,
                options: [
                  ...(field.options ?? []),
                  {
                    label: "Out for Delivery",
                    value: "out_for_delivery",
                  },
                ],
              };
            }
            return field;
          }),
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
          {
            name: "shippingMethod",
            type: "group",
            label: "Shipping Method",
            admin: {
              position: "sidebar",
            },
            fields: [
              {
                name: "serviceName",
                type: "text",
                label: "Service Name",
              },
              {
                name: "timeframe",
                type: "text",
                label: "Timeframe",
              },
              {
                name: "cost",
                type: "number",
                label: "Cost",
              },
            ],
          },
          {
            name: "shippingTrackingUrl",
            type: "text",
            label: "Shipping Tracking URL",
            admin: {
              position: "sidebar",
            },
          },
          {
            name: "shippingLabels",
            type: "upload",
            relationTo: "media",
            label: "Shipping Label Images",
            hasMany: true,
            admin: {
              position: "sidebar",
              description: "Photos of shipping labels attached to the package",
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
        ...(process.env.BANKFUL_USERNAME && process.env.BANKFUL_PASSWORD
          ? [bankfulAdapter()]
          : []),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
      variants: {
        variantsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          fields: [
            ...defaultCollection.fields,
            {
              name: "tagadaPayVariantId",
              type: "text",
              label: "TagadaPay Variant ID",
              admin: {
                description:
                  "The variant ID in TagadaPay's catalog for product mapping. Required when using TagadaPay checkout.",
                position: "sidebar",
              },
            },
          ],
        }),
        variantOptionsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          fields: defaultCollection.fields.map((field) => {
            if ("name" in field && field.name === "variantType") {
              return { ...field, admin: { readOnly: undefined } } as typeof field;
            }
            return field;
          }),
        }),
      },
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
