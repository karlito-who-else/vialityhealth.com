import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { VialityAbout } from '@/components/VialityAbout'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { homeStaticData } from '@/endpoints/seed/home-static'
import React from 'react'

import type { Page } from '@/payload-types'
import { notFound } from 'next/navigation'

function hasVialityBlocks(page: Page) {
  return page.content?.some(
    (block) => block.blockType?.startsWith('viality'),
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'about'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params }: Args) {
  const { slug = 'home' } = await params

  let page = await queryPageBySlug({
    slug,
  })

  if (slug === 'home' && (!page || !hasVialityBlocks(page))) {
    page = homeStaticData() as Page
  }

  if (!page) {
    return notFound()
  }

  if (slug === 'about') {
    const payload = await getPayload({ config: configPromise })
    const [{ docs: principles }, { docs: trustItems }, about] = await Promise.all([
      payload.find({ collection: 'principles', sort: 'order', limit: 10 }),
      payload.find({ collection: 'trustItems', where: { type: { equals: 'about' } }, sort: 'order', limit: 10 }),
      getCachedGlobal('about', 1)(),
    ])
    return <VialityAbout principles={principles} trustItems={trustItems} about={about} />
  }

  const { hero, content } = page

  return (
    <>
      <RenderHero {...hero} />
      <RenderBlocks blocks={content} />
    </>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug = 'home' } = await params

  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: draft,
    depth: 3,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs?.[0] || null
}
