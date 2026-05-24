import React from 'react'
import type { VialityFeaturedProductsBlock as VialityFeaturedProductsBlockProps, Product } from '@/payload-types'
import { FeaturedProductsSection } from '@/components/viality'

export const VialityFeaturedProductsBlock: React.FC<VialityFeaturedProductsBlockProps> = (props) => {
  const products = (props.products || []).filter(
    (p): p is Product => typeof p === 'object' && p !== null,
  )

  return (
    <FeaturedProductsSection
      heading={props.heading || 'The Collection'}
      shopAllLabel={props.shopAllLabel}
      products={products}
    />
  )
}
