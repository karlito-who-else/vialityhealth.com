import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { VialityHeroBlock } from '@/blocks/VialityHeroBlock/Component'
import { VialityPhilosophyBlock } from '@/blocks/VialityPhilosophyBlock/Component'
import { VialityFeaturedProductsBlock } from '@/blocks/VialityFeaturedProductsBlock/Component'
import { VialityTrustBlock } from '@/blocks/VialityTrustBlock/Component'
import { VialityWaitlistBlock } from '@/blocks/VialityWaitlistBlock/Component'
import { VialityShippingBlock } from '@/blocks/VialityShippingBlock/Component'
import { VialityComplianceBlock } from '@/blocks/VialityComplianceBlock/Component'
import { BenefitsBlockComponent } from '@/blocks/BenefitsBlock/Component'
import { FaqsBlockComponent } from '@/blocks/FaqsBlock/Component'
import { IngredientsBlockComponent } from '@/blocks/IngredientsBlock/Component'
import { PrinciplesBlockComponent } from '@/blocks/PrinciplesBlock/Component'
import { TrustItemsBlockComponent } from '@/blocks/TrustItemsBlock/Component'
import { ShippingInfoBlockComponent } from '@/blocks/ShippingInfoBlock/Component'
import { TrustBadgesBlockComponent } from '@/blocks/TrustBadgesBlock/Component'
import { FeaturedProductsBlockComponent } from '@/blocks/FeaturedProductsBlock/Component'
import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'

const blockComponents = {
  archive: ArchiveBlock,
  banner: BannerBlock,
  carousel: CarouselBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
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
  benefits: BenefitsBlockComponent,
  faqs: FaqsBlockComponent,
  ingredients: IngredientsBlockComponent,
  principles: PrinciplesBlockComponent,
  trustItems: TrustItemsBlockComponent,
  shippingInfo: ShippingInfoBlockComponent,
  trustBadges: TrustBadgesBlockComponent,
  featuredProducts: FeaturedProductsBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - weird type mismatch here */}
                  <Block id={toKebabCase(blockName!)} {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
