import React from "react";

import { ShippingSection } from "@/components/viality";
import type {
  ShippingInfo,
  VialityShippingBlock as VialityShippingBlockProps,
} from "@/payload-types";

export const VialityShippingBlock: React.FC<VialityShippingBlockProps> = (props) => {
  const { items: rawItems, blockName: _blockName, blockType: _blockType, id: _id, ...rest } = props;
  const items = (rawItems || []).filter(
    (s): s is ShippingInfo => typeof s === "object" && s !== null,
  );

  return <ShippingSection {...rest} items={items} />;
};
