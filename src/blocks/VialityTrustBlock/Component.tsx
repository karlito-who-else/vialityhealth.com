import React from "react";

import { TrustSection } from "@/components/viality";
import type { TrustItem, VialityTrustBlock as VialityTrustBlockProps } from "@/payload-types";

export const VialityTrustBlock: React.FC<VialityTrustBlockProps> = (props) => {
  const {
    heading,
    body,
    ctaLabel,
    ctaLink,
    items: rawItems,
    blockName,
    blockType,
    id,
    ...rest
  } = props;
  const items = (rawItems || []).filter((t): t is TrustItem => typeof t === "object" && t !== null);

  return (
    <TrustSection
      {...rest}
      heading={heading || "A quieter standard of vitality."}
      body={body}
      ctaLabel={ctaLabel}
      ctaLink={ctaLink}
      items={items}
    />
  );
};
