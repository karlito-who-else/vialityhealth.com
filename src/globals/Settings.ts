import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'viality',
    },
    {
      name: 'defaultTitle',
      type: 'text',
      defaultValue: 'viality — Wellness, refined.',
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      defaultValue:
        'viality — modern rituals for internal balance. Premium clinical wellness, formulated with precision and held to a quieter standard.',
    },
    {
      name: 'defaultOGImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Links',
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
    },
  ],
}
