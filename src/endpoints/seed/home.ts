import type { Media } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type HomeArgs = {
  metaImage: Media
  contentImage: Media
}

export const homePageData: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'none',
    },
    content: [
      {
        blockType: 'vialityHero',
        tagline: 'Wellness, refined.',
        title: 'viality',
        subtext: 'Where science meets ritual.',
        ctaLabel: 'Begin the Ritual',
        ctaLink: '/shop',
        secondaryLabel: 'Our Philosophy',
        secondaryLink: '/about',
        scrollLabel: 'Scroll',
      },
      {
        blockType: 'vialityPhilosophy',
        body: 'Modern rituals for internal balance — formulated with precision, designed for consistency, and held to a quieter standard of vitality.',
        linkLabel: 'Our Story',
        link: '/about',
      },
      {
        blockType: 'vialityFeaturedProducts',
        heading: 'The Collection',
        shopAllLabel: 'Shop All',
        products: [],
      },
      {
        blockType: 'vialityTrust',
        heading: 'A quieter standard of vitality.',
        body: 'Every formulation is open. Every claim is earned.',
        ctaLabel: 'View Lab Reports',
        ctaLink: '/about',
        items: [],
      },
      {
        blockType: 'vialityWaitlist',
        heading: 'Begin your daily reset.',
        body: 'Early access to new formulations, considered notes on modern wellness, and invitations to private events.',
        placeholder: 'YOUR EMAIL ADDRESS',
        buttonLabel: 'Join Waitlist',
      },
      {
        blockType: 'vialityShipping',
        items: [],
      },
      {
        blockType: 'vialityCompliance',
        text: 'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Always consult your healthcare provider before beginning any new wellness routine.',
      },
    ],
    meta: {
      description: 'Modern rituals for internal balance — formulated with precision, designed for consistency.',
      // @ts-ignore
      image: metaImage,
      title: 'viality — Wellness, Refined.',
    },
    title: 'Home',
  }
}
