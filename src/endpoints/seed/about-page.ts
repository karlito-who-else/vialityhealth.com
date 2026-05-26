import { RequiredDataFromCollectionSlug } from "payload";

export const aboutPageData: () => RequiredDataFromCollectionSlug<"pages"> = () => {
  return {
    slug: "about",
    _status: "published",
    hero: {
      type: "none",
    },
    content: [
      {
        blockType: "aboutHero",
        label: "Our Philosophy",
        heading: "Wellness, refined.\nA quieter standard.",
        body: "Modern rituals for internal balance — for those who understand that how you care for yourself is a reflection of how you live.",
      },
      {
        blockType: "aboutPhilosophy",
        label: "Brand Philosophy",
        heading: "Where science meets ritual — and neither is allowed to compromise the other.",
        body: [
          {
            id: "1",
            paragraph:
              "viality was built on one conviction: the things we bring into our bodies deserve the same scrutiny and care as everything else we consider important. We work with precision, not promise.",
          },
          {
            id: "2",
            paragraph:
              "We occupy a quieter corner of the wellness world — one where claims are measured, ingredients are disclosed, and the ritual of taking care of yourself is treated with the seriousness it deserves. No noise. No theatre.",
          },
          {
            id: "3",
            paragraph:
              "Designed for consistency. Every formulation is meant to be used daily, over time, as part of a considered routine — not as a quick fix or a seasonal experiment.",
          },
        ],
        imageLabel: "viality — signature formula",
      },
      {
        blockType: "aboutPrinciples",
        label: "What We Stand For",
        heading: "Three principles.\nNo exceptions.",
        items: [],
      },
      {
        blockType: "aboutTrust",
        label: "Our Standards",
        heading: "The science is visible.\nBy design.",
        body: "We operate with complete openness. Nothing is hidden behind proprietary blends or ambiguous quantities. Every claim we make is verifiable.",
        imageLabel: "Third-Party Verified",
        buttonLabel: "Request Certificate of Analysis",
        items: [],
      },
      {
        blockType: "aboutFounder",
        label: "A Note from the Founders",
        quote: '"We built viality because we were tired of choosing between what works and what feels worthy of the care we put into ourselves. Modern rituals for internal balance shouldn\'t require compromise. That conviction is built into every decision we make — from the compounds we select to the language we use to describe them."',
        signature: "The viality Team",
      },
      {
        blockType: "aboutCta",
        heading: "Designed for\nconsistency.",
        body: "Where science meets ritual. Formulations built to be used daily, for the long term — with complete transparency about everything inside them.",
        links: [
          {
            link: {
              type: "custom",
              label: "Shop Formulas",
              url: "/shop",
            },
          },
          {
            link: {
              type: "custom",
              label: "View Lab Reports",
              url: "/about",
            },
          },
        ],
        complianceText:
          "These statements have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease.",
      },
    ],
    meta: {
      description:
        "Modern rituals for internal balance — formulated with precision, designed for consistency, and held to a quieter standard of vitality.",
      title: "About — viality",
    },
    title: "About",
  };
};
