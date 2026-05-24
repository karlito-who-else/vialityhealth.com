import type { Block } from 'payload'

export const BenefitsBlock: Block = {
  slug: 'benefits',
  interfaceName: 'BenefitsBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'benefits',
      hasMany: true,
      label: 'Benefits',
    },
  ],
  labels: {
    plural: 'Benefits',
    singular: 'Benefits',
  },
}
