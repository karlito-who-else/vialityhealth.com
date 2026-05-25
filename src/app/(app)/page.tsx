import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { homeStaticData } from '@/endpoints/seed/home-static'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import type { Page } from '@/payload-types'
import React from 'react'

function hasVialityBlocks(page: Page) {
  return page.layout?.some(
    (block) => block.blockType?.startsWith('viality'),
  )
}

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

  if (!page || !hasVialityBlocks(page)) {
    page = homeStaticData() as Page
  }

  const { hero, layout } = page

  return (
    <>
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </>
  )
}
