import React from 'react'
import type { BenefitsBlockType, Benefit } from '@/payload-types'

export const BenefitsBlockComponent: React.FC<BenefitsBlockType> = (props) => {
  const items = (props.items || []).filter(
    (b): b is Benefit => typeof b === 'object' && b !== null,
  )

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <h2 className="font-serif italic text-4xl text-primary mb-12 text-center">
            {props.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.slug} className="flex flex-col gap-3 p-6 border border-border rounded">
              <h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold">
                {item.title}
              </h3>
              <p className="text-sm text-primary/55 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
