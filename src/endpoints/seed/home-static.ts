import { RequiredDataFromCollectionSlug } from "payload";

export const homeStaticData: () => RequiredDataFromCollectionSlug<"pages"> = () => {
  return {
    slug: "home",
    _status: "published",
    hero: {
      type: "none",
    },
    content: [
      {
        blockType: "vialityHero",
        tagline: "Wellness, refined.",
        title: "viality",
        subtext: "Where science meets ritual.",
        links: [
          {
            link: {
              type: "custom",
              label: "Begin the Ritual",
              url: "/shop",
            },
          },
          {
            link: {
              type: "custom",
              label: "Our Philosophy",
              url: "/about",
            },
          },
        ],
        scrollLabel: "Scroll",
      },
      {
        blockType: "vialityPhilosophy",
        body: "Modern rituals for internal balance — formulated with precision, designed for consistency, and held to a quieter standard of vitality.",
        link: {
          type: "custom",
          label: "Our Story",
          url: "/about",
        },
      },
      {
        blockType: "vialityFeaturedProducts",
        heading: "The Collection",
        shopAllLabel: "Shop All",
        products: [
          {
            id: 0,
            title: "Inner Reset",
            slug: "inner-reset",
            priceInUSD: 88,
            meta: { description: "Daily balance, by design." },
            updatedAt: "",
            createdAt: "",
          },
          {
            id: 1,
            title: "Evening Ritual",
            slug: "evening-ritual",
            priceInUSD: 75,
            meta: { description: "A quieter end to every day." },
            updatedAt: "",
            createdAt: "",
          },
          {
            id: 2,
            title: "Clear Focus",
            slug: "clear-focus",
            priceInUSD: 90,
            meta: { description: "Calm clarity. Designed for consistency." },
            updatedAt: "",
            createdAt: "",
          },
        ],
      },
      {
        blockType: "vialityTrust",
        heading: "A quieter standard of vitality.",
        body: "Every formulation is open. Every claim is earned. We believe in complete transparency — not as a selling point, but as the only responsible way to operate.",
        link: {
          type: "custom",
          label: "View Lab Reports",
          url: "/about",
        },
        items: [
          {
            id: 0,
            title: "Evidence-led",
            slug: "evidence-led",
            description:
              "Each compound earns its place through peer-reviewed science, not wellness trends.",
            type: "home",
            order: 0,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 1,
            title: "Third-Party Verified",
            slug: "third-party-verified",
            description:
              "Every batch is independently tested. Certificates of analysis, always available.",
            type: "home",
            order: 1,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 2,
            title: "Nothing unnecessary",
            slug: "nothing-unnecessary",
            description: "No fillers, no artificial colorants. Only what belongs.",
            type: "home",
            order: 2,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 3,
            title: "GMP Manufactured",
            slug: "gmp-manufactured",
            description: "Produced in a certified facility where consistency is non-negotiable.",
            type: "home",
            order: 3,
            createdAt: "",
            updatedAt: "",
          },
        ],
      },
      {
        blockType: "vialityWaitlist",
        heading: "Begin your daily reset.",
        body: "Early access to new formulations, considered notes on modern wellness, and invitations to private events.",
        placeholder: "YOUR EMAIL ADDRESS",
        buttonLabel: "Join Waitlist",
      },
      {
        blockType: "vialityShipping",
        items: [
          {
            id: 0,
            label: "Complimentary Shipping",
            slug: "free-shipping",
            detail: "On all orders over $75",
            order: 0,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 1,
            label: "Batch Verified",
            slug: "batch-verified",
            detail: "Third-party COA available for every formulation",
            order: 1,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: 2,
            label: "30-Day Guarantee",
            slug: "30-day-guarantee",
            detail: "Designed for consistency. Backed by confidence.",
            order: 2,
            createdAt: "",
            updatedAt: "",
          },
        ],
      },
      {
        blockType: "vialityCompliance",
        text: "These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Always consult your healthcare provider before beginning any new wellness routine.",
      },
    ],
    meta: {
      description:
        "Modern rituals for internal balance — formulated with precision, designed for consistency.",
      title: "viality — Wellness, Refined.",
    },
    title: "Home",
  };
};
