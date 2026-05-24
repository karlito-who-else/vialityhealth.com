import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { homeStaticData } from '@/endpoints/seed/home-static'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import type { Page } from '@/payload-types'
import React from 'react'

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    depth: 2,
    pagination: false,
    where: {
      and: [{ slug: { equals: 'home' } }, ...(draft ? [] : [{ _status: { equals: 'published' as const } }])],
    },
  })

  let page = result.docs?.[0] || null

  if (!page) {
    page = homeStaticData() as Page
  }

  const { hero, layout } = page

  const hasVialityBlocks = layout?.some(
    (block) => block.blockType?.startsWith('viality'),
  )

  if (hasVialityBlocks) {
    return (
      <>
        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} />
      </>
    )
  }

  return (
    <article className="pt-16 pb-24">
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}
