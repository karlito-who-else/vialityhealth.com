import { createLocalReq, getPayload } from 'payload'
import { homeStaticData } from '@/endpoints/seed/home-static'
import config from '@payload-config'
import { headers } from 'next/headers'
import { checkRole } from '@/access/utilities'

async function upsertCollection(payload: any, collection: string, slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  if (existing.docs.length > 0) {
    return payload.update({ collection, id: existing.docs[0].id, data })
  }
  return payload.create({ collection, data })
}

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !checkRole(['admin'], user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const req = await createLocalReq({ user }, payload)

    const productDefs = [
      { title: 'Inner Reset', slug: 'inner-reset', priceInUSD: 88, description: 'Daily balance, by design.' },
      { title: 'Evening Ritual', slug: 'evening-ritual', priceInUSD: 75, description: 'A quieter end to every day.' },
      { title: 'Clear Focus', slug: 'clear-focus', priceInUSD: 90, description: 'Calm clarity. Designed for consistency.' },
    ]

    for (const def of productDefs) {
      await upsertCollection(payload, 'products', def.slug, {
        title: def.title,
        slug: def.slug,
        _status: 'published',
        priceInUSD: def.priceInUSD,
        meta: { description: def.description },
      })
    }

    const trustItemDefs = [
      { title: 'Evidence-led', slug: 'evidence-led', description: 'Each compound earns its place through peer-reviewed science, not wellness trends.', type: 'home', order: 0 },
      { title: 'Third-Party Verified', slug: 'third-party-verified', description: 'Every batch is independently tested. Certificates of analysis, always available.', type: 'home', order: 1 },
      { title: 'Nothing unnecessary', slug: 'nothing-unnecessary', description: 'No fillers, no artificial colorants. Only what belongs.', type: 'home', order: 2 },
      { title: 'GMP Manufactured', slug: 'gmp-manufactured', description: 'Produced in a certified facility where consistency is non-negotiable.', type: 'home', order: 3 },
    ]

    for (const item of trustItemDefs) {
      await upsertCollection(payload, 'trustItems', item.slug, item)
    }

    const shippingDefs = [
      { label: 'Complimentary Shipping', slug: 'free-shipping', detail: 'On all orders over $75', order: 0 },
      { label: 'Batch Verified', slug: 'batch-verified', detail: 'Third-party COA available for every formulation', order: 1 },
      { label: '30-Day Guarantee', slug: '30-day-guarantee', detail: 'Designed for consistency. Backed by confidence.', order: 2 },
    ]

    for (const item of shippingDefs) {
      await upsertCollection(payload, 'shippingInfo', item.slug, item)
    }

    const { docs: allProducts } = await payload.find({ collection: 'products', sort: 'createdAt', limit: 10, req })
    const { docs: homeTrustItemDocs } = await payload.find({ collection: 'trustItems', where: { type: { equals: 'home' } }, sort: 'order', limit: 10, req })
    const { docs: allShippingInfo } = await payload.find({ collection: 'shippingInfo', sort: 'order', limit: 10, req })

    const data = homeStaticData()
    const content = (data.content || []).map((block) => {
      if (block.blockType === 'vialityFeaturedProducts') {
        return { ...block, products: allProducts.map((p) => p.id) }
      }
      if (block.blockType === 'vialityTrust') {
        return { ...block, items: homeTrustItemDocs.map((t) => t.id) }
      }
      if (block.blockType === 'vialityShipping') {
        return { ...block, items: allShippingInfo.map((s) => s.id) }
      }
      return block
    })

    const page = await payload.create({
      collection: 'pages',
      data: {
        ...data,
        slug: 'home-new',
        title: 'Home new',
        content,
      },
      req,
    })

    return Response.json({ success: true, id: page.id })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error creating home-new page' })
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500 })
  }
}
