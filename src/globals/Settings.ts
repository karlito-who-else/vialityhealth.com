import type { GlobalConfig } from "payload";

import { adminOnly } from "@/access/adminOnly";

export const Settings: GlobalConfig = {
  slug: "settings",
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "viality",
    },
    {
      name: "defaultTitle",
      type: "text",
      defaultValue: "viality — Wellness, refined.",
    },
    {
      name: "defaultDescription",
      type: "textarea",
      defaultValue:
        "viality — modern rituals for internal balance. Premium clinical wellness, formulated with precision and held to a quieter standard.",
    },
    {
      name: "defaultOGImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Site Logo (SVG)",
      admin: {
        description:
          "Upload an SVG for the site logo. SVGs render inline at any size without quality loss.",
      },
    },
    {
      name: "emailLogo",
      type: "upload",
      relationTo: "media",
      label: "Email Logo (PNG/JPG)",
      admin: {
        description:
          "Upload a raster image (PNG or JPG) for use in transactional emails. Most email clients do not support SVG, so use a standard image format here.",
      },
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social Links",
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
    },
    {
      name: "siteBanner",
      type: "group",
      label: "Site Banner",
      admin: {
        description: "A global announcement banner displayed above the header on every page.",
      },
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Enable site banner",
          defaultValue: true,
        },
        {
          name: "content",
          type: "text",
          label: "Banner text",
          defaultValue: "Free shipping on orders over $200",
        },
      ],
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Product Page",
          fields: [
            {
              name: "benefitsLabelTemplate",
              type: "text",
              defaultValue: "Why {title}",
            },
            {
              name: "benefitsHeading",
              type: "text",
              defaultValue: "A quieter standard of vitality.",
            },
            {
              name: "usageRitualLabel",
              type: "text",
              defaultValue: "Usage Ritual",
            },
            {
              name: "usageRitualHeading",
              type: "text",
              defaultValue: "Unhurried. Intentional. Daily.",
            },
            {
              name: "usageRitualBody",
              type: "textarea",
              defaultValue:
                "Two capsules each morning with water, ideally alongside a meal. The ritual is simple by design — consistency is where the value accumulates. We recommend a minimum 30-day commitment before forming any assessment.",
            },
            {
              name: "usageRitualDisclaimer",
              type: "textarea",
              defaultValue:
                "Take as directed on packaging. Consult a qualified healthcare professional before beginning any new supplement routine, particularly if pregnant, nursing, or under medical supervision.",
            },
            {
              name: "verificationLabel",
              type: "text",
              defaultValue: "Verification",
            },
            {
              name: "verificationHeading",
              type: "text",
              defaultValue: "Verified clarity,\nbatch by batch.",
            },
            {
              name: "verificationBody",
              type: "textarea",
              defaultValue:
                "Certificates of Analysis are available for every production run. We don't ask you to take our word for it — the data is there, and it belongs to you.",
            },
            {
              name: "labReportLabel",
              type: "text",
              defaultValue: "View Lab Report",
            },
            {
              name: "requestCOALabel",
              type: "text",
              defaultValue: "Request Full COA",
            },
            {
              name: "completeRitualHeading",
              type: "text",
              defaultValue: "Complete the Ritual",
            },
            {
              name: "productDisclaimer",
              type: "textarea",
              defaultValue:
                "This product is not intended to diagnose, treat, cure, or prevent any disease. These statements have not been evaluated by the Food and Drug Administration. Individual results may vary. Always consult a qualified healthcare professional before beginning any new supplement routine, especially if you are pregnant, nursing, taking medications, or have an existing health condition.",
            },
            {
              name: "collectionLabel",
              type: "text",
              defaultValue: "viality — Flagship Collection",
            },
            {
              name: "supplyLabel",
              type: "text",
              defaultValue: "60 Capsules · 30-Day Supply",
            },
            {
              name: "subscribeEnabled",
              type: "checkbox",
              defaultValue: true,
              admin: {
                description:
                  "When disabled, the subscription option is hidden and only one-time purchase is shown.",
              },
            },
            {
              name: "purchaseOptionLabel",
              type: "text",
              defaultValue: "Purchase Option",
            },
            {
              name: "subscribeLabel",
              type: "text",
              defaultValue: "Subscribe & Save 10%",
            },
            {
              name: "subscribeDiscountPercent",
              type: "number",
              defaultValue: 15,
              min: 0,
              max: 100,
              admin: {
                description:
                  "Discount percentage applied to the subscription price. Default: 10%.",
              },
            },
            {
              name: "subscribeDetail",
              type: "text",
              defaultValue: "Delivered every 30 days. Cancel anytime.",
            },
            {
              name: "oneTimeLabel",
              type: "text",
              defaultValue: "One-Time Purchase",
            },
            {
              name: "quantityLabel",
              type: "text",
              defaultValue: "Quantity",
            },
            {
              name: "buyNowLabel",
              type: "text",
              defaultValue: "Buy Now",
            },
            {
              name: "shippingText",
              type: "text",
              defaultValue:
                "Free shipping on orders over $75. Same-day dispatch on orders placed before 2 PM EST.",
            },
            {
              name: "ingredientsHeading",
              type: "text",
              defaultValue: "Full formulation breakdown",
            },
            {
              name: "otherIngredientsText",
              type: "text",
              defaultValue:
                "Other ingredients: Hydroxypropyl methylcellulose (vegetable capsule), microcrystalline cellulose. Free from gluten, soy, dairy, artificial colorants, and preservatives.",
            },
            {
              name: "faqLabel",
              type: "text",
              defaultValue: "Questions",
            },
            {
              name: "faqHeading",
              type: "text",
              defaultValue: "Everything you need to know.",
            },
          ],
        },
        {
          label: "Bank Transfer",
          fields: [
            {
              name: "bankTransferEnabled",
              type: "checkbox",
              label: "Enable bank transfer notification",
              defaultValue: true,
            },
            {
              name: "bankTransferHeading",
              type: "text",
              defaultValue: "Bank Transfer",
            },
            {
              name: "bankTransferNote",
              type: "textarea",
              defaultValue:
                "Your order will be shipped once your bank transfer is confirmed. Please transfer the total amount to the account below:",
            },
            {
              name: "bankName",
              type: "text",
              label: "Bank Name",
            },
            {
              name: "accountName",
              type: "text",
              label: "Account Name",
            },
            {
              name: "accountNumber",
              type: "text",
              label: "Account Number",
            },
            {
              name: "routingNumber",
              type: "text",
              label: "Routing / Sort Code",
            },
            {
              name: "swiftCode",
              type: "text",
              label: "SWIFT / BIC Code",
            },
          ],
        },
        {
          label: "Account & Orders",
          fields: [
            {
              name: "loginWarning",
              type: "text",
              defaultValue: "Please login to access your account settings.",
            },
            {
              name: "ordersLoginWarning",
              type: "text",
              defaultValue: "Please login to access your orders.",
            },
            {
              name: "alreadyLoggedInWarning",
              type: "text",
              defaultValue: "You are already logged in.",
            },
            {
              name: "accountHeading",
              type: "text",
              defaultValue: "Account settings",
            },
            {
              name: "recentOrdersHeading",
              type: "text",
              defaultValue: "Recent Orders",
            },
            {
              name: "recentOrdersDescription",
              type: "textarea",
              defaultValue:
                "These are the most recent orders you have placed. Each order is associated with an payment. As you place more orders, they will appear in your orders list.",
            },
            {
              name: "noOrdersText",
              type: "text",
              defaultValue: "You have no orders.",
            },
            {
              name: "viewAllOrdersLabel",
              type: "text",
              defaultValue: "View all orders",
            },
            {
              name: "ordersHeading",
              type: "text",
              defaultValue: "Orders",
            },
            {
              name: "allOrdersLabel",
              type: "text",
              defaultValue: "All orders",
            },
            {
              name: "orderNumberPrefix",
              type: "text",
              defaultValue: "Order #",
            },
            {
              name: "orderDateLabel",
              type: "text",
              defaultValue: "Order Date",
            },
            {
              name: "totalLabel",
              type: "text",
              defaultValue: "Total",
            },
            {
              name: "statusLabel",
              type: "text",
              defaultValue: "Status",
            },
            {
              name: "itemsLabel",
              type: "text",
              defaultValue: "Items",
            },
            {
              name: "itemUnavailableText",
              type: "text",
              defaultValue: "This item is no longer available.",
            },
            {
              name: "shippingAddressLabel",
              type: "text",
              defaultValue: "Shipping Address",
            },
            {
              name: "addressesHeading",
              type: "text",
              defaultValue: "Addresses",
            },
            {
              name: "loginHeading",
              type: "text",
              defaultValue: "Log in",
            },
            {
              name: "loginDescription",
              type: "textarea",
              defaultValue:
                "This is where your customers will login to manage their account, review their order history, and more. To manage all users, login to the admin dashboard.",
            },
            {
              name: "createAccountHeading",
              type: "text",
              defaultValue: "Create Account",
            },
          ],
        },
      ],
    },
  ],
};
