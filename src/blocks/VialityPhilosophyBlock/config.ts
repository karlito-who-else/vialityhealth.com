import type { Block } from 'payload'

export const VialityPhilosophy: Block = {
  slug: 'vialityPhilosophy',
  interfaceName: 'VialityPhilosophyBlock',
  fields: [
    {
      name: 'body',
      type: 'textarea',
      defaultValue:
        'Modern rituals for internal balance — formulated with precision, designed for consistency, and held to a quieter standard of vitality.',
    },
    {
      name: 'linkLabel',
      type: 'text',
      defaultValue: 'Our Story',
    },
    {
      name: 'link',
      type: 'text',
      defaultValue: '/about',
    },
  ],
  labels: {
    plural: 'Viality Philosophies',
    singular: 'Viality Philosophy',
  },
}
