import { getPayload } from 'payload'
import { homeStaticData } from '@/endpoints/seed/home-static'
import config from '@payload-config'
import { headers } from 'next/headers'
import { checkRole } from '@/access/utilities'

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()

  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user || !checkRole(['admin'], user)) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const data = homeStaticData()
    const content = (data.content || []).map((block) => {
      if (block.blockType === 'vialityFeaturedProducts') {
        return { ...block, products: [] }
      }
      if (block.blockType === 'vialityTrust') {
        return { ...block, items: [] }
      }
      if (block.blockType === 'vialityShipping') {
        return { ...block, items: [] }
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
    })
    return Response.json({ success: true, id: page.id })
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error creating home-new page' })
    return new Response(JSON.stringify({ error: 'Error creating page.', detail: (e as Error).message }), { status: 500 })
  }
}
