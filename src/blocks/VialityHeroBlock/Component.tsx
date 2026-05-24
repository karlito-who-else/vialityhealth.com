import React from 'react'
import type { VialityHeroBlock as VialityHeroBlockProps } from '@/payload-types'
import { HeroSection } from '@/components/viality'

export const VialityHeroBlock: React.FC<VialityHeroBlockProps> = (props) => {
  return (
    <HeroSection
      tagline={props.tagline || 'Wellness, refined.'}
      title={props.title || 'viality'}
      subtext={props.subtext}
      ctaLabel={props.ctaLabel || 'Begin the Ritual'}
      ctaLink={props.ctaLink || '/shop'}
      secondaryLabel={props.secondaryLabel}
      secondaryLink={props.secondaryLink}
      scrollLabel={props.scrollLabel || 'Scroll'}
    />
  )
}
