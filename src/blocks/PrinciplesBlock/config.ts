import type { Block } from 'payload'

export const PrinciplesBlock: Block = {
  slug: 'principles',
  interfaceName: 'PrinciplesBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'subheadline',
      type: 'text',
      label: 'Subheadline',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'principles',
      hasMany: true,
      label: 'Principles',
    },
  ],
  labels: {
    plural: 'Principles',
    singular: 'Principle',
  },
}
