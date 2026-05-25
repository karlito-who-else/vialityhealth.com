import type { Block } from "payload";

export const VialityShipping: Block = {
  slug: "vialityShipping",
  interfaceName: "VialityShippingBlock",
  fields: [
    {
      name: "items",
      type: "relationship",
      relationTo: "shippingInfo",
      hasMany: true,
      label: "Shipping Info Items",
    },
  ],
  labels: {
    plural: "Viality Shippings",
    singular: "Viality Shipping",
  },
};
