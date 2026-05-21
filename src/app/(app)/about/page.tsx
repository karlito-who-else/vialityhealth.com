import { VialityAbout } from '@/components/VialityAbout'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: trustItems } = await payload.find({
    collection: 'trustItems',
    where: { type: { equals: 'about' } },
    sort: 'order',
    limit: 10,
  })

  return <VialityAbout trustItems={trustItems} />
}
