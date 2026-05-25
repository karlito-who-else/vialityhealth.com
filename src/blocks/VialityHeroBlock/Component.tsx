import { HeroSection } from '@/components/viality'
import type { VialityHeroBlock as VialityHeroBlockProps } from '@/payload-types'
import React from 'react'

export const VialityHeroBlock: React.FC<VialityHeroBlockProps> = (props) => {
  const { tagline, title, subtext, ctaLabel, ctaLink, secondaryLabel, secondaryLink, scrollLabel, blockName, blockType, id, ...rest } = props
  return (
    <HeroSection
      {...rest}
      tagline={tagline || 'Wellness, refined.'}
      title={title || 'viality'}
      subtext={subtext}
      ctaLabel={ctaLabel || 'Begin the Ritual'}
      ctaLink={ctaLink || '/shop'}
      secondaryLabel={secondaryLabel}
      secondaryLink={secondaryLink}
      scrollLabel={scrollLabel || 'Scroll'}
    />
  )
}
