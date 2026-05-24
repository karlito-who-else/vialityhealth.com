import React from 'react'
import type { IngredientsBlockType, Ingredient } from '@/payload-types'

export const IngredientsBlockComponent: React.FC<IngredientsBlockType> = (props) => {
  const items = (props.items || []).filter(
    (i): i is Ingredient => typeof i === 'object' && i !== null,
  )

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {props.heading && (
          <h2 className="font-serif italic text-4xl text-primary mb-12 text-center">
            {props.heading}
          </h2>
        )}
        <div className="border border-border rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f2efea]">
                <th className="text-left py-4 px-6 text-[11px] uppercase tracking-[0.18em] font-semibold">
                  Ingredient
                </th>
                <th className="text-right py-4 px-6 text-[11px] uppercase tracking-[0.18em] font-semibold">
                  Dose
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug} className="border-t border-border/30">
                  <td className="py-3 px-6 text-sm text-primary/80">{item.name}</td>
                  <td className="py-3 px-6 text-sm text-primary/60 text-right">{item.dose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
