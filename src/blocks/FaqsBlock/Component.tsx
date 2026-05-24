import React from 'react'
import type { FaqsBlockType, Faq } from '@/payload-types'

export const FaqsBlockComponent: React.FC<FaqsBlockType> = (props) => {
  const items = (props.items || []).filter(
    (f): f is Faq => typeof f === 'object' && f !== null,
  )

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        {props.heading && (
          <h2 className="font-serif italic text-4xl text-primary mb-12 text-center">
            {props.heading}
          </h2>
        )}
        <div className="space-y-1">
          {items.map((item) => (
            <details key={item.slug} className="group border-b border-border/30">
              <summary className="py-5 cursor-pointer text-[11px] uppercase tracking-[0.18em] font-semibold hover:text-primary/70 transition-colors">
                {item.question}
              </summary>
              <p className="pb-5 text-sm text-primary/55 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
