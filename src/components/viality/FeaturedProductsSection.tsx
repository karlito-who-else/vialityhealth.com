'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/payload-types'

export type FeaturedProductsSectionProps = {
  heading: string
  shopAllLabel?: string | null
  products: Product[]
}

export function FeaturedProductsSection({
  heading,
  shopAllLabel,
  products,
}: FeaturedProductsSectionProps) {
  return (
    <section className="py-24 px-6 bg-surface-warm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-serif italic text-4xl text-primary">{heading}</h2>
          {shopAllLabel && (
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-[0.2em] hidden md:inline-block border-b border-transparent hover:border-primary/30 pb-1 transition-colors"
            >
              {shopAllLabel}
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <Link href="/shop">
                <div className="aspect-[3/4] mb-6 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                  {p.featuredImage && typeof p.featuredImage === 'object' ? (
                    <img
                      src={p.featuredImage.url || ''}
                      alt={p.featuredImage.alt || p.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-primary/20 font-serif italic text-6xl tracking-wider">v</div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="uppercase tracking-[0.18em] text-xs font-medium">{p.title}</h3>
                    {typeof p.priceInUSD === 'number' && (
                      <span className="text-sm font-light">${p.priceInUSD.toFixed(0)}</span>
                    )}
                  </div>
                  <p className="text-primary/55 text-sm">{p.meta?.description || ''}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {shopAllLabel && (
          <div className="mt-12 text-center md:hidden">
            <Link
              href="/shop"
              className="inline-block border-b border-primary/30 pb-1 text-[11px] uppercase tracking-[0.2em]"
            >
              {shopAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
