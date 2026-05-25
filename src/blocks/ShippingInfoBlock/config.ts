import type { Block } from 'payload'

export const ShippingInfoBlock: Block = {
  slug: 'shippingInfo',
  interfaceName: 'ShippingInfoBlockType',
  fields: [
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'shippingInfo',
      hasMany: true,
      label: 'Shipping Info Items',
    },
  ],
  labels: {
    plural: 'Shipping Info',
    singular: 'Shipping Info Item',
  },
}
