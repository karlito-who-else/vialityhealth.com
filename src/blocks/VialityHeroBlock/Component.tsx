import React from "react";

import { HeroSection } from "@/components/viality";
import type { VialityHeroBlock as VialityHeroBlockProps } from "@/payload-types";

export const VialityHeroBlock: React.FC<VialityHeroBlockProps> = (props) => {
  const {
    tagline,
    title,
    subtext,
    links,
    scrollLabel,
    blockName: _blockName,
    blockType: _blockType,
    id: _id,
    ...rest
  } = props;
  return (
    <HeroSection
      {...rest}
      tagline={tagline || "Wellness, refined."}
      title={title || "viality"}
      subtext={subtext}
      links={links}
      scrollLabel={scrollLabel || "Scroll"}
    />
  );
};
