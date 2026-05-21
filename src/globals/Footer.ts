import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'viality',
    },
    {
      name: 'brandDescription',
      type: 'textarea',
      defaultValue:
        'Wellness, refined. Modern rituals for internal balance — designed for consistency, and held to a quieter standard.',
    },
    {
      name: 'exploreHeading',
      type: 'text',
      defaultValue: 'Explore',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
    {
      name: 'connectHeading',
      type: 'text',
      defaultValue: 'Connect',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Connect / Social Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      maxRows: 6,
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Legal Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      maxRows: 6,
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: '© {year} viality. All rights reserved.',
    },
    {
      name: 'complianceText',
      type: 'textarea',
      defaultValue:
        'These statements have not been evaluated by the Food and Drug Administration.\nThis product is not intended to diagnose, treat, cure, or prevent any disease.',
    },
  ],
}
