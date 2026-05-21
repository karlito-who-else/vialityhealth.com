import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'heroTagline',
      type: 'text',
      defaultValue: 'Wellness, refined.',
    },
    {
      name: 'heroTitle',
      type: 'text',
      defaultValue: 'viality',
    },
    {
      name: 'heroSubtext',
      type: 'text',
      defaultValue: 'Where science meets ritual.',
    },
    {
      name: 'heroCTALabel',
      type: 'text',
      defaultValue: 'Begin the Ritual',
    },
    {
      name: 'heroCTALink',
      type: 'text',
      defaultValue: '/shop',
    },
    {
      name: 'heroSecondaryLabel',
      type: 'text',
      defaultValue: 'Our Philosophy',
    },
    {
      name: 'heroSecondaryLink',
      type: 'text',
      defaultValue: '/about',
    },
    {
      name: 'heroScrollLabel',
      type: 'text',
      defaultValue: 'Scroll',
    },
    {
      name: 'philosophyBody',
      type: 'textarea',
      defaultValue:
        'Modern rituals for internal balance — formulated with precision, designed for consistency, and held to a quieter standard of vitality.',
    },
    {
      name: 'philosophyLinkLabel',
      type: 'text',
      defaultValue: 'Our Story',
    },
    {
      name: 'philosophyLink',
      type: 'text',
      defaultValue: '/about',
    },
    {
      name: 'collectionHeading',
      type: 'text',
      defaultValue: 'The Collection',
    },
    {
      name: 'shopAllLabel',
      type: 'text',
      defaultValue: 'Shop All',
    },
    {
      name: 'trustHeading',
      type: 'text',
      defaultValue: 'A quieter standard of vitality.',
    },
    {
      name: 'trustBody',
      type: 'textarea',
      defaultValue:
        'Every formulation is open. Every claim is earned. We believe in complete transparency — not as a selling point, but as the only responsible way to operate.',
    },
    {
      name: 'trustCTALabel',
      type: 'text',
      defaultValue: 'View Lab Reports',
    },
    {
      name: 'trustCTALink',
      type: 'text',
      defaultValue: '/about',
    },
    {
      name: 'waitlistHeading',
      type: 'text',
      defaultValue: 'Begin your daily reset.',
    },
    {
      name: 'waitlistBody',
      type: 'textarea',
      defaultValue:
        'Early access to new formulations, considered notes on modern wellness, and invitations to private events. Nothing more.',
    },
    {
      name: 'waitlistPlaceholder',
      type: 'text',
      defaultValue: 'YOUR EMAIL ADDRESS',
    },
    {
      name: 'waitlistButtonLabel',
      type: 'text',
      defaultValue: 'Join Waitlist',
    },
    {
      name: 'complianceText',
      type: 'textarea',
      defaultValue:
        'These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Always consult your healthcare provider before beginning any new wellness routine.',
    },
  ],
}
