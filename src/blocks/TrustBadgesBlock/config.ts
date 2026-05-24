import type { Block } from 'payload'

export const TrustBadgesBlock: Block = {
  slug: 'trustBadges',
  interfaceName: 'TrustBadgesBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'trustBadges',
      hasMany: true,
      label: 'Trust Badges',
    },
  ],
  labels: {
    plural: 'Trust Badges',
    singular: 'Trust Badge',
  },
}
