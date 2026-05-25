import React from "react";

import { FeaturedProductsSection } from "@/components/viality";
import type {
  Product,
  VialityFeaturedProductsBlock as VialityFeaturedProductsBlockProps,
} from "@/payload-types";

export const VialityFeaturedProductsBlock: React.FC<VialityFeaturedProductsBlockProps> = (
  props,
) => {
  const { heading, shopAllLabel, products: rawProducts, blockName: _blockName, blockType: _blockType, id: _id, ...rest } = props;
  const products = (rawProducts || []).filter(
    (p): p is Product => typeof p === "object" && p !== null,
  );

  return (
    <section {...rest}>
      <FeaturedProductsSection
        heading={heading || "The Collection"}
        shopAllLabel={shopAllLabel}
        products={products}
      />
    </section>
  );
};
