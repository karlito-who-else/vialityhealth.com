import type { Block } from 'payload'

export const IngredientsBlock: Block = {
  slug: 'ingredients',
  interfaceName: 'IngredientsBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'ingredients',
      hasMany: true,
      label: 'Ingredients',
    },
  ],
  labels: {
    plural: 'Ingredients',
    singular: 'Ingredient',
  },
}
