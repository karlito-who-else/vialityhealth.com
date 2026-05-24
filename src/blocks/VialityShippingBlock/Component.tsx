import React from 'react'
import type { VialityShippingBlock as VialityShippingBlockProps, ShippingInfo } from '@/payload-types'
import { ShippingSection } from '@/components/viality'

export const VialityShippingBlock: React.FC<VialityShippingBlockProps> = (props) => {
  const items = (props.items || []).filter(
    (s): s is ShippingInfo => typeof s === 'object' && s !== null,
  )

  return <ShippingSection items={items} />
}
