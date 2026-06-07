import React, { Fragment } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

import { AboutCtaBlockComponent } from "@/blocks/AboutCtaBlock/Component";
import { AboutFounderBlockComponent } from "@/blocks/AboutFounderBlock/Component";
import { AboutHeroBlockComponent } from "@/blocks/AboutHeroBlock/Component";
import { AboutPhilosophyBlockComponent } from "@/blocks/AboutPhilosophyBlock/Component";
import { AboutPrinciplesBlockComponent } from "@/blocks/AboutPrinciplesBlock/Component";
import { AboutTrustBlockComponent } from "@/blocks/AboutTrustBlock/Component";
import { ArchiveBlock } from "@/blocks/ArchiveBlock/Component";
import { BannerBlock } from "@/blocks/Banner/Component";
import { CallToActionBlock } from "@/blocks/CallToAction/Component";
import { CarouselBlock } from "@/blocks/Carousel/Component";
import { ContentBlock } from "@/blocks/Content/Component";
import { FaqBlockComponent } from "@/blocks/FaqBlock/Component";
import { FormBlock } from "@/blocks/Form/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { ThreeItemGridBlock } from "@/blocks/ThreeItemGrid/Component";
import { VialityComplianceBlock } from "@/blocks/VialityComplianceBlock/Component";
import { VialityFeaturedProductsBlock } from "@/blocks/VialityFeaturedProductsBlock/Component";
import { VialityHeroBlock } from "@/blocks/VialityHeroBlock/Component";
import { VialityPhilosophyBlock } from "@/blocks/VialityPhilosophyBlock/Component";
import { VialityShippingBlock } from "@/blocks/VialityShippingBlock/Component";
import { VialityTrustBlock } from "@/blocks/VialityTrustBlock/Component";
import { VialityWaitlistBlock } from "@/blocks/VialityWaitlistBlock/Component";
import { toKebabCase } from "@/utilities/toKebabCase";

const blockComponents: Record<string, React.FC<any>> = {
  aboutCta: AboutCtaBlockComponent,
  aboutFounder: AboutFounderBlockComponent,
  aboutHero: AboutHeroBlockComponent,
  aboutPhilosophy: AboutPhilosophyBlockComponent,
  aboutPrinciples: AboutPrinciplesBlockComponent,
  aboutTrust: AboutTrustBlockComponent,
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faqBlock: FaqBlockComponent,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  threeItemGrid: ThreeItemGridBlock,
  vialityHero: VialityHeroBlock,
  vialityPhilosophy: VialityPhilosophyBlock,
  vialityFeaturedProducts: VialityFeaturedProductsBlock,
  vialityTrust: VialityTrustBlock,
  vialityWaitlist: VialityWaitlistBlock,
  vialityShipping: VialityShippingBlock,
  vialityCompliance: VialityComplianceBlock,
};

export const RenderBlocks: React.FC<{
  blocks: { blockType: string; blockName?: string | null; id?: string | null }[];
}> = (props) => {
  const { blocks } = props;

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <LazyMotion features={domAnimation}>
        <Fragment>
          {blocks.map((block, index) => {
            const { blockName, blockType } = block;

            if (blockType && blockType in blockComponents) {
              const Block = blockComponents[blockType];

              if (Block) {
                return (
                  <Block
                    id={toKebabCase(blockName!) as any}
                    key={index}
                    data-block-type={blockType}
                    {...(block as any)}
                  />
                );
              }
            }

            return null;
          })}
        </Fragment>
      </LazyMotion>
    );
  }

  return null;
};
