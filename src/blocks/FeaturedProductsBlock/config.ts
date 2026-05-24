import type { Block } from 'payload'

export const FeaturedProductsBlock: Block = {
  slug: 'featuredProducts',
  interfaceName: 'FeaturedProductsBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Featured Products',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Products',
    },
  ],
  labels: {
    plural: 'Featured Products',
    singular: 'Featured Product',
  },
}
