import React from 'react'
import type { TrustBadgesBlockType, TrustBadge } from '@/payload-types'

export const TrustBadgesBlockComponent: React.FC<TrustBadgesBlockType> = (props) => {
  const items = (props.items || []).filter(
    (b): b is TrustBadge => typeof b === 'object' && b !== null,
  )

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <h2 className="font-serif italic text-4xl text-primary mb-8 text-center">
            {props.heading}
          </h2>
        )}
        <div className="flex flex-wrap justify-center gap-6">
          {items.map((item) => (
            <div
              key={item.slug}
              className="px-8 py-4 border border-border/40 rounded flex items-center gap-3 bg-surface-section"
            >
              <div className="w-2 h-2 bg-accent" />
              <span className="text-[11px] uppercase tracking-[0.15em] font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
