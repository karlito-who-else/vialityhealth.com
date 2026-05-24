import React from 'react'
import type { VialityTrustBlock as VialityTrustBlockProps, TrustItem } from '@/payload-types'
import { TrustSection } from '@/components/viality'

export const VialityTrustBlock: React.FC<VialityTrustBlockProps> = (props) => {
  const items = (props.items || []).filter(
    (t): t is TrustItem => typeof t === 'object' && t !== null,
  )

  return (
    <TrustSection
      heading={props.heading || 'A quieter standard of vitality.'}
      body={props.body}
      ctaLabel={props.ctaLabel}
      ctaLink={props.ctaLink}
      items={items}
    />
  )
}
