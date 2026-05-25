import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ThreeItemGridBlock } from '@/blocks/ThreeItemGrid/Component'
import { VialityComplianceBlock } from '@/blocks/VialityComplianceBlock/Component'
import { VialityFeaturedProductsBlock } from '@/blocks/VialityFeaturedProductsBlock/Component'
import { VialityHeroBlock } from '@/blocks/VialityHeroBlock/Component'
import { VialityPhilosophyBlock } from '@/blocks/VialityPhilosophyBlock/Component'
import { VialityShippingBlock } from '@/blocks/VialityShippingBlock/Component'
import { VialityTrustBlock } from '@/blocks/VialityTrustBlock/Component'
import { VialityWaitlistBlock } from '@/blocks/VialityWaitlistBlock/Component'
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
}

export const RenderBlocks: React.FC<{
  blocks: Page['content'][0][]
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
                <Block id={toKebabCase(blockName!)} key={index} data-block-type={blockType} {...block} />
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
