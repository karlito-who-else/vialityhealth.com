import React from 'react'
import type { PrinciplesBlockType, Principle } from '@/payload-types'

export const PrinciplesBlockComponent: React.FC<PrinciplesBlockType> = (props) => {
  const items = (props.items || []).filter(
    (p): p is Principle => typeof p === 'object' && p !== null,
  )

  return (
    <section className="py-24 px-6 bg-surface-section">
      <div className="max-w-7xl mx-auto">
        {(props.heading || props.subheadline) && (
          <div className="mb-20 text-center">
            {props.subheadline && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary/40 mb-5">
                {props.subheadline}
              </p>
            )}
            {props.heading && (
              <h2 className="font-serif italic text-4xl md:text-5xl text-primary">
                {props.heading}
              </h2>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {items.map((principle) => (
            <div key={principle.slug} className="flex flex-col">
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-primary/10">
                <span className="font-serif italic text-5xl text-primary/12 leading-none select-none">
                  {principle.displayNumber}
                </span>
                <h3 className="font-serif italic text-3xl text-primary leading-none mt-1">
                  {principle.title}
                </h3>
              </div>
              <p className="text-primary/55 text-sm leading-[1.9] font-light">{principle.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
