import type { Block } from 'payload'

export const FaqsBlock: Block = {
  slug: 'faqs',
  interfaceName: 'FaqsBlockType',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      label: 'FAQs',
    },
  ],
  labels: {
    plural: 'FAQs',
    singular: 'FAQ',
  },
}
