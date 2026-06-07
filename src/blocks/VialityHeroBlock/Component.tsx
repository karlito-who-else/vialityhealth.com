import React from "react";

import { HeroSection } from "@/components/viality";
import type { VialityHeroBlock as VialityHeroBlockProps } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";

export const VialityHeroBlock: React.FC<VialityHeroBlockProps> = async (props) => {
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

  const [settings] = await Promise.all([
    getCachedGlobal("settings", 2)(),
  ]);

  const { logo, siteName } = settings;

  return (
    <HeroSection
      {...rest}
      tagline={tagline || "Wellness, refined."}
      title={title || "viality"}
      subtext={subtext}
      links={links}
      scrollLabel={scrollLabel || "Scroll"}
      logo={logo}
      siteTitle={siteName}
    />
  );
};
