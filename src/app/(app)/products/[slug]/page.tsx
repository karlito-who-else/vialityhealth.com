import type { Media, Product } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Gallery } from '@/components/product/Gallery'
import { VialityProductDescription } from '@/components/product/VialityProductDescription'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { Metadata } from 'next'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
          images: [
            {
              alt: seoImage?.alt,
              height: seoImage.height!,
              url: seoImage?.url,
              width: seoImage.width!,
            },
          ],
        }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      {/* TOP SPLIT — GALLERY + PURCHASE */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-[calc(100vh-72px)]">
        {/* LEFT — Image gallery */}
        <div className="relative bg-[#f0ece4] flex flex-col order-2 lg:order-1">
          <div className="relative flex-1 min-h-[60vw] md:min-h-[520px] lg:min-h-0 overflow-hidden">
            {gallery.length > 0 ? (
              <div className="absolute inset-0">
                <Suspense fallback={<div className="absolute inset-0 bg-[#eae6de]" />}>
                  <Gallery gallery={gallery} />
                </Suspense>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#eae6de] flex items-center justify-center">
                <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Sticky purchase module */}
        <div className="lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] overflow-y-auto order-1 lg:order-2 border-l border-border/40">
          <VialityProductDescription product={product} />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#f5f2ec] py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/35 mb-6">Why {product.title}</p>
            <h2 className="font-serif italic text-4xl md:text-5xl text-primary leading-tight">
              A quieter standard of vitality.
            </h2>
          </div>
          <div className="space-y-8">
            {[
              {
                title: 'Designed for consistency',
                body: 'Where science meets ritual. Built to be taken daily, over time — not as an experiment, but as a permanent part of how you care for yourself.',
              },
              {
                title: 'Modern rituals for internal balance',
                body: 'No complicated protocol. Designed to integrate into your morning with the same quiet ease as any other considered habit.',
              },
              {
                title: 'Calm, sustained clarity',
                body: 'Selected to support mental steadiness without stimulants — the kind of clarity that comes from giving your body what it actually needs.',
              },
              {
                title: 'A quieter standard',
                body: 'No aggressive claims. No overcrowded formula. Every ingredient earns its place through evidence, and its dose is disclosed without exception.',
              },
            ].map((b, i) => (
              <div
                key={i}
                className="border-l-2 border-accent/50 pl-5"
              >
                <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold mb-1.5">{b.title}</h3>
                <p className="text-sm text-primary/55 font-light leading-[1.8]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USAGE RITUAL */}
      <section className="bg-background py-20 md:py-28 px-6 md:px-16 border-t border-border/30">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10 md:gap-20 items-start">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/35 md:pt-1">Usage Ritual</p>
          <div>
            <h2 className="font-serif italic text-3xl md:text-4xl text-primary mb-6">
              Unhurried. Intentional. Daily.
            </h2>
            <p className="text-primary/60 text-sm font-light leading-[1.9] max-w-lg mb-4">
              Two capsules each morning with water, ideally alongside a meal. The ritual is simple by design — consistency is where the value accumulates. We recommend a minimum 30-day commitment before forming any assessment.
            </p>
            <p className="text-[11px] text-primary/40 font-light italic">
              Take as directed on packaging. Consult a qualified healthcare professional before beginning any new supplement routine, particularly if pregnant, nursing, or under medical supervision.
            </p>
          </div>
        </div>
      </section>

      {/* LAB REPORTS */}
      <section className="bg-[#1c1916] py-20 md:py-24 px-6 md:px-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
            mixBlendMode: 'screen',
          }}
        />
        <div className="relative z-10 max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mb-4">Verification</p>
            <h2 className="font-serif italic text-3xl md:text-4xl text-white/90 leading-tight max-w-md">
              Verified clarity,<br />batch by batch.
            </h2>
            <p className="text-white/40 text-sm font-light leading-relaxed mt-4 max-w-sm">
              Certificates of Analysis are available for every production run. We don't ask you to take our word for it — the data is there, and it belongs to you.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button className="flex items-center gap-3 px-7 py-4 border border-white/20 text-white/70 text-[11px] uppercase tracking-[0.2em] hover:border-white/40 hover:text-white/90 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              View Lab Report
            </button>
            <button className="flex items-center gap-3 px-7 py-4 bg-white/8 border border-white/10 text-white/60 text-[11px] uppercase tracking-[0.2em] hover:bg-white/12 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
              Request Full COA
            </button>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length ? (
        <RelatedProducts products={relatedProducts as Product[]} />
      ) : null}

      {/* DISCLAIMER */}
      <section className="bg-background border-t border-border/25 py-10 px-6 md:px-16">
        <p className="max-w-[1100px] mx-auto text-[10px] text-primary/28 leading-relaxed tracking-wide">
          This product is not intended to diagnose, treat, cure, or prevent any disease. These statements have not been evaluated by the Food and Drug Administration. Individual results may vary. Always consult a qualified healthcare professional before beginning any new supplement routine, especially if you are pregnant, nursing, taking medications, or have an existing health condition.
        </p>
      </section>
    </div>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="py-24 px-6 bg-[#f7f5f0]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif italic text-4xl text-primary mb-16">Complete the Ritual</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <li key={product.id}>
              <Link href={`/products/${product.slug}`} className="group">
                <div className="aspect-[3/4] mb-6 bg-[#eae6de] relative overflow-hidden flex items-center justify-center">
                  <span className="text-primary/20 font-serif italic text-6xl tracking-wider">v</span>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="uppercase tracking-[0.18em] text-xs font-medium">{product.title}</h3>
                  {typeof product.priceInUSD === 'number' && (
                    <span className="text-sm font-light">${product.priceInUSD.toFixed(0)}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
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
    populate: {
      variants: {
        title: true,
        priceInUSD: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}
