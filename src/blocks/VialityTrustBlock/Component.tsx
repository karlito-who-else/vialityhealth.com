import React from "react";

import { TrustSection } from "@/components/viality";
import type { TrustItem, VialityTrustBlock as VialityTrustBlockProps } from "@/payload-types";

export const VialityTrustBlock: React.FC<VialityTrustBlockProps> = (props) => {
  const {
    heading,
    body,
    link,
    items: rawItems,
    blockName: _blockName,
    blockType: _blockType,
    id: _id,
    ...rest
  } = props;
  const items = (rawItems || []).filter((t): t is TrustItem => typeof t === "object" && t !== null);

  return (
    <TrustSection
      {...rest}
      heading={heading || "A quieter standard of vitality."}
      body={body}
      link={link}
      items={items}
    />
  );
};
