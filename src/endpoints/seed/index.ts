import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from "payload";

import { Address, Transaction, VariantOption } from "@/payload-types";

import { aboutPageData } from "./about-page";
import { contactFormData } from "./contact-form";
import { contactPageData } from "./contact-page";
import { homePageData } from "./home";
import { imageHatData } from "./image-hat";
import { imageHero1Data } from "./image-hero-1";
import { imageTshirtBlackData } from "./image-tshirt-black";
import { imageTshirtWhiteData } from "./image-tshirt-white";
import { productHatData } from "./product-hat";
import { productTshirtData, productTshirtVariant } from "./product-tshirt";

const collections: CollectionSlug[] = [
  "categories",

  "media",
  "pages",
  "products",
  "forms",
  "form-submissions",
  "variants",
  "variantOptions",
  "variantTypes",
  "carts",
  "transactions",
  "addresses",
  "orders",
];

const categories = ["Accessories", "T-Shirts", "Hats"];

const sizeVariantOptions = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
  { label: "X Large", value: "xlarge" },
];

const colorVariantOptions = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
];

const globals: GlobalSlug[] = ["header", "footer", "settings"];

const baseAddressUSData: Transaction["billingAddress"] = {
  title: "Dr.",
  firstName: "Otto",
  lastName: "Octavius",
  phone: "1234567890",
  company: "Oscorp",
  addressLine1: "123 Main St",
  addressLine2: "Suite 100",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "US",
};

const baseAddressUKData: Transaction["billingAddress"] = {
  title: "Mr.",
  firstName: "Oliver",
  lastName: "Twist",
  phone: "1234567890",
  addressLine1: "48 Great Portland St",
  city: "London",
  postalCode: "W1W 7ND",
  country: "GB",
};

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload;
  req: PayloadRequest;
}): Promise<void> => {
  payload.logger.info("Seeding database...");

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`);

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {} as any,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  );

  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} });
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} });
    }
  }

  payload.logger.info(`— Seeding customer and customer data...`);

  await payload.delete({
    collection: "users",
    depth: 0,
    where: {
      email: {
        equals: "customer@example.com",
      },
    },
  });

  payload.logger.info(`— Seeding media...`);

  const [imageHatBuffer, imageTshirtBlackBuffer, imageTshirtWhiteBuffer, heroBuffer] =
    await Promise.all([
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/ecommerce/src/endpoints/seed/hat-logo.png",
      ),
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/ecommerce/src/endpoints/seed/tshirt-black.png",
      ),
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/ecommerce/src/endpoints/seed/tshirt-white.png",
      ),
      fetchFileByURL(
        "https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp",
      ),
    ]);

  const [
    customer,
    imageHat,
    imageTshirtBlack,
    imageTshirtWhite,
    imageHero,
    accessoriesCategory,
    tshirtsCategory,
    hatsCategory,
  ] = await Promise.all([
    payload.create({
      collection: "users",
      data: {
        name: "Customer",
        email: "customer@example.com",
        password: "password",
        roles: ["customer"],
      },
    }),
    payload.create({
      collection: "media",
      data: imageHatData,
      file: imageHatBuffer,
    }),
    payload.create({
      collection: "media",
      data: imageTshirtBlackData,
      file: imageTshirtBlackBuffer,
    }),
    payload.create({
      collection: "media",
      data: imageTshirtWhiteData,
      file: imageTshirtWhiteBuffer,
    }),
    payload.create({
      collection: "media",
      data: imageHero1Data,
      file: heroBuffer,
    }),
    ...categories.map((category) =>
      payload.create({
        collection: "categories",
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ]);

  payload.logger.info(`— Seeding variant types and options...`);

  const sizeVariantType = await payload.create({
    collection: "variantTypes",
    data: {
      name: "size",
      label: "Size",
    },
  });

  const sizeVariantOptionsResults: VariantOption[] = [];

  for (const option of sizeVariantOptions) {
    const result = await payload.create({
      collection: "variantOptions",
      data: {
        ...option,
        variantType: sizeVariantType.id,
      },
    });
    sizeVariantOptionsResults.push(result);
  }

  const [small, medium, large, xlarge] = sizeVariantOptionsResults;

  const colorVariantType = await payload.create({
    collection: "variantTypes",
    data: {
      name: "color",
      label: "Color",
    },
  });

  const [black, white] = await Promise.all(
    colorVariantOptions.map((option) => {
      return payload.create({
        collection: "variantOptions",
        data: {
          ...option,
          variantType: colorVariantType.id,
        },
      });
    }),
  );

  payload.logger.info(`— Seeding products...`);

  const productHat = await payload.create({
    collection: "products",
    depth: 0,
    data: productHatData({
      galleryImage: imageHat,
      metaImage: imageHat,
      variantTypes: [colorVariantType],
      categories: [hatsCategory],
      relatedProducts: [],
    }),
  });

  const productTshirt = await payload.create({
    collection: "products",
    depth: 0,
    data: productTshirtData({
      galleryImages: [
        { image: imageTshirtBlack, variantOption: black },
        { image: imageTshirtWhite, variantOption: white },
      ],
      metaImage: imageTshirtBlack,
      contentImage: imageHero,
      variantTypes: [colorVariantType, sizeVariantType],
      categories: [tshirtsCategory],
      relatedProducts: [productHat],
    }),
  });

  let hoodieID: number | string = productTshirt.id;

  if (payload.db.defaultIDType === "text") {
    hoodieID = `"${hoodieID}"`;
  }

  const [
    smallTshirtHoodieVariant,
    mediumTshirtHoodieVariant,
    largeTshirtHoodieVariant,
    xlargeTshirtHoodieVariant,
  ] = await Promise.all(
    [small, medium, large, xlarge].map((variantOption) =>
      payload.create({
        collection: "variants",
        depth: 0,
        data: productTshirtVariant({
          product: productTshirt,
          variantOptions: [variantOption, white],
        }),
      }),
    ),
  );

  await Promise.all(
    [small, medium, large, xlarge].map((variantOption) =>
      payload.create({
        collection: "variants",
        depth: 0,
        data: productTshirtVariant({
          product: productTshirt,
          variantOptions: [variantOption, black],
          ...(variantOption.value === "medium" ? { inventory: 0 } : {}),
        }),
      }),
    ),
  );

  payload.logger.info(`— Seeding contact form...`);

  const contactForm = await payload.create({
    collection: "forms",
    depth: 0,
    data: contactFormData(),
  });

  payload.logger.info(`— Seeding pages...`);

  const [_homePage, contactPage, aboutPage] = await Promise.all([
    payload.create({
      collection: "pages",
      depth: 0,
      data: homePageData({
        contentImage: imageHero,
        metaImage: imageHat,
      }),
    }),
    payload.create({
      collection: "pages",
      depth: 0,
      data: contactPageData({
        contactForm: contactForm,
      }),
    }),
    payload.create({
      collection: "pages",
      depth: 0,
      data: aboutPageData(),
    }),
  ]);

  payload.logger.info(`— Seeding addresses...`);

  const customerUSAddress = await payload.create({
    collection: "addresses",
    depth: 0,
    data: {
      customer: customer.id,
      ...(baseAddressUSData as Address),
    },
  });

  const customerUKAddress = await payload.create({
    collection: "addresses",
    depth: 0,
    data: {
      customer: customer.id,
      ...(baseAddressUKData as Address),
    },
  });

  payload.logger.info(`— Seeding transactions...`);

  const pendingTransaction = await payload.create({
    collection: "transactions",
    data: {
      currency: "USD",
      customer: customer.id,
      paymentMethod: "stripe",
      stripe: {
        customerID: "cus_123",
        paymentIntentID: "pi_123",
      },
      status: "pending",
      billingAddress: baseAddressUSData,
    },
  });

  const succeededTransaction = await payload.create({
    collection: "transactions",
    data: {
      currency: "USD",
      customer: customer.id,
      paymentMethod: "stripe",
      stripe: {
        customerID: "cus_123",
        paymentIntentID: "pi_123",
      },
      status: "succeeded",
      billingAddress: baseAddressUSData,
    },
  });

  let succeededTransactionID: number | string = succeededTransaction.id;

  if (payload.db.defaultIDType === "text") {
    succeededTransactionID = `"${succeededTransactionID}"`;
  }

  payload.logger.info(`— Seeding carts...`);

  // This cart is open as it's created now
  const openCart = await payload.create({
    collection: "carts",
    data: {
      customer: customer.id,
      currency: "USD",
      items: [
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
    },
  });

  const oldTimestamp = new Date("2023-01-01T00:00:00Z").toISOString();

  // Cart is abandoned because it was created long in the past
  const abandonedCart = await payload.create({
    collection: "carts",
    data: {
      currency: "USD",
      createdAt: oldTimestamp,
      items: [
        {
          product: productHat.id,
          quantity: 1,
        },
      ],
    },
  });

  // Cart is purchased because it has a purchasedAt date
  const completedCart = await payload.create({
    collection: "carts",
    data: {
      customer: customer.id,
      currency: "USD",
      purchasedAt: new Date().toISOString(),
      subtotal: 7499,
      items: [
        {
          product: productTshirt.id,
          variant: smallTshirtHoodieVariant.id,
          quantity: 1,
        },
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
    },
  });

  let completedCartID: number | string = completedCart.id;

  if (payload.db.defaultIDType === "text") {
    completedCartID = `"${completedCartID}"`;
  }

  payload.logger.info(`— Seeding orders...`);

  const orderInCompleted = await payload.create({
    collection: "orders",
    data: {
      amount: 7499,
      currency: "USD",
      customer: customer.id,
      shippingAddress: baseAddressUSData,
      items: [
        {
          product: productTshirt.id,
          variant: smallTshirtHoodieVariant.id,
          quantity: 1,
        },
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
      status: "completed",
      transactions: [succeededTransaction.id],
    },
  });

  const orderInProcessing = await payload.create({
    collection: "orders",
    data: {
      amount: 7499,
      currency: "USD",
      customer: customer.id,
      shippingAddress: baseAddressUSData,
      items: [
        {
          product: productTshirt.id,
          variant: smallTshirtHoodieVariant.id,
          quantity: 1,
        },
        {
          product: productTshirt.id,
          variant: mediumTshirtHoodieVariant.id,
          quantity: 1,
        },
      ],
      status: "processing",
      transactions: [succeededTransaction.id],
    },
  });

  payload.logger.info(`— Seeding globals...`);

  await Promise.all([
    payload.updateGlobal({
      slug: "header",
      data: {
        siteTitle: "viality",
        navItems: [
          {
            link: {
              type: "custom",
              label: "Home",
              url: "/",
            },
          },
          {
            link: {
              type: "custom",
              label: "Shop",
              url: "/shop",
            },
          },
          {
            link: {
              type: "custom",
              label: "Account",
              url: "/account",
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: "footer",
      data: {
        brandName: "viality",
        brandDescription:
          "Wellness, refined. Modern rituals for internal balance — designed for consistency, and held to a quieter standard.",
        navItems: [
          {
            link: {
              type: "custom",
              label: "Home",
              url: "/",
            },
          },
          {
            link: {
              type: "custom",
              label: "Philosophy",
              url: "/about",
            },
          },
          {
            link: {
              type: "custom",
              label: "Shop",
              url: "/shop",
            },
          },
          {
            link: {
              type: "custom",
              label: "Lab Reports",
              url: "/about",
            },
          },
        ],
        socialLinks: [
          {
            label: "Contact",
            url: "/contact",
          },
          {
            label: "Instagram",
            url: "#",
          },
          {
            label: "Wholesale",
            url: "#",
          },
        ],
        legalLinks: [
          {
            label: "Privacy",
            url: "#",
          },
          {
            label: "Terms",
            url: "#",
          },
        ],
        copyright: "© {year} viality. All rights reserved.",
        complianceText:
          "These statements have not been evaluated by the Food and Drug Administration.\nThis product is not intended to diagnose, treat, cure, or prevent any disease.",
      },
    }),
    payload.updateGlobal({
      slug: "settings",
      data: {
        siteName: "viality",
        defaultTitle: "viality — Wellness, refined.",
        defaultDescription:
          "viality — modern rituals for internal balance. Premium clinical wellness, formulated with precision and held to a quieter standard.",
        collectionLabel: "viality — Flagship Collection",
        supplyLabel: "60 Capsules · 30-Day Supply",
        purchaseOptionLabel: "Purchase Option",
        subscribeLabel: "Subscribe & Save 15%",
        subscribeDetail: "Delivered every 30 days. Cancel anytime.",
        oneTimeLabel: "One-Time Purchase",
        quantityLabel: "Quantity",
        buyNowLabel: "Buy Now",
        shippingText:
          "Free shipping on orders over $75. Same-day dispatch on orders placed before 2 PM EST.",
        ingredientsHeading: "Full formulation breakdown",
        otherIngredientsText:
          "Other ingredients: Hydroxypropyl methylcellulose (vegetable capsule), microcrystalline cellulose. Free from gluten, soy, dairy, artificial colorants, and preservatives.",
        faqLabel: "Questions",
        faqHeading: "Everything you need to know.",
        benefitsLabelTemplate: "Why {title}",
        benefitsHeading: "A quieter standard of vitality.",
        usageRitualLabel: "Usage Ritual",
        usageRitualHeading: "Unhurried. Intentional. Daily.",
        usageRitualBody:
          "Two capsules each morning with water, ideally alongside a meal. The ritual is simple by design — consistency is where the value accumulates. We recommend a minimum 30-day commitment before forming any assessment.",
        usageRitualDisclaimer:
          "Take as directed on packaging. Consult a qualified healthcare professional before beginning any new supplement routine, particularly if pregnant, nursing, or under medical supervision.",
        verificationLabel: "Verification",
        verificationHeading: "Verified clarity,\nbatch by batch.",
        verificationBody:
          "Certificates of Analysis are available for every production run. We don't ask you to take our word for it — the data is there, and it belongs to you.",
        labReportLabel: "View Lab Report",
        requestCOALabel: "Request Full COA",
        completeRitualHeading: "Complete the Ritual",
        productDisclaimer:
          "This product is not intended to diagnose, treat, cure, or prevent any disease. These statements have not been evaluated by the Food and Drug Administration. Individual results may vary. Always consult a qualified healthcare professional before beginning any new supplement routine, especially if you are pregnant, nursing, taking medications, or have an existing health condition.",
        loginWarning: "Please login to access your account settings.",
        ordersLoginWarning: "Please login to access your orders.",
        alreadyLoggedInWarning: "You are already logged in.",
        accountHeading: "Account settings",
        recentOrdersHeading: "Recent Orders",
        recentOrdersDescription:
          "These are the most recent orders you have placed. Each order is associated with an payment. As you place more orders, they will appear in your orders list.",
        noOrdersText: "You have no orders.",
        viewAllOrdersLabel: "View all orders",
        ordersHeading: "Orders",
        allOrdersLabel: "All orders",
        orderNumberPrefix: "Order #",
        orderDateLabel: "Order Date",
        totalLabel: "Total",
        statusLabel: "Status",
        itemsLabel: "Items",
        itemUnavailableText: "This item is no longer available.",
        shippingAddressLabel: "Shipping Address",
        addressesHeading: "Addresses",
        loginHeading: "Log in",
        loginDescription:
          "This is where your customers will login to manage their account, review their order history, and more. To manage all users, login to the admin dashboard.",
        createAccountHeading: "Create Account",
      },
    }),
    payload.updateGlobal({
      slug: "about",
      data: {
        heroLabel: "Our Philosophy",
        heroHeading: "Wellness, refined.\nA quieter standard.",
        heroBody:
          "Modern rituals for internal balance — for those who understand that how you care for yourself is a reflection of how you live.",
        philosophyLabel: "Brand Philosophy",
        philosophyHeading:
          "Where science meets ritual — and neither is allowed to compromise the other.",
        philosophyBody: [
          {
            paragraph:
              "viality was built on one conviction: the things we bring into our bodies deserve the same scrutiny and care as everything else we consider important. We work with precision, not promise.",
          },
          {
            paragraph:
              "We occupy a quieter corner of the wellness world — one where claims are measured, ingredients are disclosed, and the ritual of taking care of yourself is treated with the seriousness it deserves. No noise. No theatre.",
          },
          {
            paragraph:
              "Designed for consistency. Every formulation is meant to be used daily, over time, as part of a considered routine — not as a quick fix or a seasonal experiment.",
          },
        ],
        philosophyImageLabel: "viality — signature formula",
        principlesLabel: "What We Stand For",
        principlesHeading: "Three principles.\nNo exceptions.",
        trustLabel: "Our Standards",
        trustHeading: "The science is visible.\nBy design.",
        trustBody:
          "We operate with complete openness. Nothing is hidden behind proprietary blends or ambiguous quantities. Every claim we make is verifiable.",
        trustImageLabel: "Third-Party Verified",
        trustButtonLabel: "Request Certificate of Analysis",
        founderLabel: "A Note from the Founders",
        founderQuote:
          '"We built viality because we were tired of choosing between what works and what feels worthy of the care we put into ourselves. Modern rituals for internal balance shouldn\'t require compromise. That conviction is built into every decision we make — from the compounds we select to the language we use to describe them."',
        founderSignature: "The viality Team",
        ctaHeading: "Designed for\nconsistency.",
        ctaBody:
          "Where science meets ritual. Formulations built to be used daily, for the long term — with complete transparency about everything inside them.",
        ctaShopLabel: "Shop Formulas",
        ctaLabLabel: "View Lab Reports",
        complianceText:
          "These statements have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease.",
      },
    }),
  ]);

  payload.logger.info("Seeded database successfully!");
};

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: "include",
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`);
  }

  const data = await res.arrayBuffer();

  return {
    name: url.split("/").pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split(".").pop()}`,
    size: data.byteLength,
  };
}
