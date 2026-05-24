import React from 'react'
import type { ShippingInfoBlockType, ShippingInfo } from '@/payload-types'
import { ShippingSection } from '@/components/viality'

export const ShippingInfoBlockComponent: React.FC<ShippingInfoBlockType> = (props) => {
  const items = (props.items || []).filter(
    (s): s is ShippingInfo => typeof s === 'object' && s !== null,
  )

  return <ShippingSection items={items} />
}
