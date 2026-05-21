import { VialityHome } from '@/components/VialityHome'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: trustItems }, { docs: shippingItems }] = await Promise.all([
    payload.find({
      collection: 'trustItems',
      where: { type: { equals: 'home' } },
      sort: 'order',
      limit: 10,
    }),
    payload.find({
      collection: 'shippingInfo',
      sort: 'order',
      limit: 10,
    }),
  ])

  return <VialityHome trustItems={trustItems} shippingItems={shippingItems} />
}
