'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { TrustItem } from '@/payload-types'

export type TrustSectionProps = {
  heading: string
  body?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  items: TrustItem[]
}

export function TrustSection({
  heading,
  body,
  ctaLabel,
  ctaLink,
  items,
}: TrustSectionProps) {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 grid grid-cols-2 gap-x-8 gap-y-12">
          {items.map((item, i) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="w-7 h-7 border border-primary/15 flex items-center justify-center mb-2">
                <div className="w-1.5 h-1.5 bg-accent" />
              </div>
              <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold">{item.title}</h4>
              <p className="text-sm text-primary/55 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="order-1 md:order-2">
          <h2 className="font-serif italic text-4xl mb-6">{heading}</h2>
          {body && (
            <p className="text-primary/65 mb-10 leading-relaxed max-w-md">
              {body}
            </p>
          )}
          {ctaLabel && ctaLink && (
            <Link
              href={ctaLink}
              className="px-8 py-4 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.2em] hover:bg-primary/88 transition-colors inline-block"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
