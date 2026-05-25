import type { Block } from "payload";

export const VialityFeaturedProducts: Block = {
  slug: "vialityFeaturedProducts",
  interfaceName: "VialityFeaturedProductsBlock",
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "The Collection",
    },
    {
      name: "shopAllLabel",
      type: "text",
      defaultValue: "Shop All",
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      label: "Products",
    },
  ],
  labels: {
    plural: "Viality Featured Products",
    singular: "Viality Featured Products",
  },
};
