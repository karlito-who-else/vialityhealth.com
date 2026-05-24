import React from 'react'
import type { TrustItemsBlockType, TrustItem } from '@/payload-types'

export const TrustItemsBlockComponent: React.FC<TrustItemsBlockType> = (props) => {
  const items = (props.items || []).filter(
    (t): t is TrustItem => typeof t === 'object' && t !== null,
  )

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <h2 className="font-serif italic text-4xl text-primary mb-6">
            {props.heading}
          </h2>
        )}
        {props.body && (
          <p className="text-primary/55 text-sm leading-relaxed mb-12 max-w-2xl">
            {props.body}
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.slug} className="flex flex-col gap-3">
              <div className="w-7 h-7 border border-primary/15 flex items-center justify-center mb-2">
                <div className="w-1.5 h-1.5 bg-accent" />
              </div>
              <h4 className="text-[11px] uppercase tracking-[0.18em] font-semibold">{item.title}</h4>
              <p className="text-sm text-primary/55 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
