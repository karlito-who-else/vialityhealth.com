import React from 'react'
import type { FeaturedProductsBlockType, Product } from '@/payload-types'

export const FeaturedProductsBlockComponent: React.FC<FeaturedProductsBlockType> = (props) => {
  const products = (props.products || []).filter(
    (p): p is Product => typeof p === 'object' && p !== null,
  )

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        {props.heading && (
          <h2 className="font-serif italic text-4xl text-primary mb-12 text-center">
            {props.heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((p) => (
            <div key={p.slug} className="group cursor-pointer">
              <div className="aspect-[3/4] mb-6 bg-[#eae6de] relative overflow-hidden flex items-center justify-center">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
