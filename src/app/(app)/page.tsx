import type { FeaturedProduct, Product } from '@/payload-types'

import { VialityHome } from '@/components/VialityHome'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: trustItems }, { docs: shippingItems }, { docs: rawFeatured }, home] = await Promise.all([
    payload.find({ collection: 'trustItems', where: { type: { equals: 'home' } }, sort: 'order', limit: 10 }),
    payload.find({ collection: 'shippingInfo', sort: 'order', limit: 10 }),
    payload.find({ collection: 'featuredProducts', sort: 'order', limit: 10, depth: 2 }),
    getCachedGlobal('home', 1)(),
  ])

  const featuredProducts = rawFeatured.filter(
    (fp): fp is FeaturedProduct & { product: Product } =>
      typeof fp.product === 'object' && fp.product !== null,
  )

  return <VialityHome trustItems={trustItems} shippingItems={shippingItems} featuredProducts={featuredProducts} home={home} />
}
