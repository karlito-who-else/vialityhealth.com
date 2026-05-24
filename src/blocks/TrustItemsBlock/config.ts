import type { Block } from 'payload'

export const TrustItemsBlock: Block = {
  slug: 'trustItems',
  interfaceName: 'TrustItemsBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Body',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'trustItems',
      hasMany: true,
      label: 'Trust Items',
    },
  ],
  labels: {
    plural: 'Trust Items',
    singular: 'Trust Item',
  },
}
