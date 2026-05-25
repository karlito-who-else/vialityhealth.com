import type { ShippingInfo } from '@/payload-types'

export type ShippingSectionProps = {
  items: ShippingInfo[]
}

export function ShippingSection({ items }: ShippingSectionProps) {
  return (
    <section className="py-16 px-6 bg-surface-section border-t border-border/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold">{item.label}</p>
            <p className="text-xs text-primary/50">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
