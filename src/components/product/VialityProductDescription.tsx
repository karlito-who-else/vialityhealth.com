'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ChevronDown } from 'lucide-react'
import type { Product, Faq, Ingredient, TrustBadge, Setting } from '@/payload-types'
import { AddToCart } from '@/components/Cart/AddToCart'
import { RichText } from '@/components/RichText'

export function VialityProductDescription({ product, faqs, ingredients, trustBadges, productContent }: { product: Product; faqs: Faq[]; ingredients: Ingredient[]; trustBadges: TrustBadge[]; productContent: Setting }) {
  const [quantity, setQuantity] = useState(1)
  const [isSubscription, setIsSubscription] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [ingredientsOpen, setIngredientsOpen] = useState(false)

  const oneTimePrice = product.priceInUSD || 88
  const subPrice = Math.round(oneTimePrice * 0.85)
  const displayPrice = isSubscription ? subPrice : oneTimePrice

  const collectionLabel = productContent?.collectionLabel || 'viality — Flagship Collection'
  const supplyLabel = productContent?.supplyLabel || '60 Capsules · 30-Day Supply'
  const purchaseOptionLabel = productContent?.purchaseOptionLabel || 'Purchase Option'
  const subscribeLabel = productContent?.subscribeLabel || 'Subscribe & Save 15%'
  const subscribeDetail = productContent?.subscribeDetail || 'Delivered every 30 days. Cancel anytime.'
  const oneTimeLabel = productContent?.oneTimeLabel || 'One-Time Purchase'
  const quantityLabel = productContent?.quantityLabel || 'Quantity'
  const buyNowLabel = productContent?.buyNowLabel || 'Buy Now'
  const shippingText = productContent?.shippingText || ''
  const ingredientsHeading = productContent?.ingredientsHeading || 'Full formulation breakdown'
  const otherIngredientsText = productContent?.otherIngredientsText || ''
  const faqLabel = productContent?.faqLabel || 'Questions'
  const faqHeading = productContent?.faqHeading || 'Everything you need to know.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="p-8 xl:p-12 flex flex-col gap-8"
    >
      {/* Header */}
      <div>
        <p className="text-[9px] uppercase tracking-widest text-primary/35 mb-3">
          {collectionLabel}
        </p>
        <h1 className="font-serif italic text-4xl xl:text-5xl text-primary leading-tight mb-2">
          {product.title}
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-primary/40 mb-5">
          {supplyLabel}
        </p>
        <p className="text-sm text-primary/60 font-light leading-[1.8] max-w-sm">
          {product.description ? <RichText data={product.description} /> : 'Modern rituals for internal balance. A quietly precise daily formula — designed for consistency, and held to a standard most wellness products never meet.'}
        </p>
      </div>

      {/* Subscribe & Save toggle */}
      <div className="space-y-2.5">
        <p className="text-[9px] uppercase tracking-widest text-primary/35 mb-3">
          {purchaseOptionLabel}
        </p>
        <button
          onClick={() => setIsSubscription(true)}
          className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all duration-200 ${
            isSubscription
              ? 'border-primary/60 bg-primary/[0.03]'
              : 'border-border/50 hover:border-primary/20'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                isSubscription ? 'border-primary' : 'border-border'
              }`}
            >
              {isSubscription && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-widest font-medium">{subscribeLabel}</div>
              <div className="text-[9px] text-primary/40 mt-0.5 tracking-wide">{subscribeDetail}</div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">${subPrice}.00</span>
            <span className="text-[9px] text-primary/35 line-through">${oneTimePrice}.00</span>
          </div>
        </button>

        <button
          onClick={() => setIsSubscription(false)}
          className={`w-full flex items-center justify-between px-4 py-3.5 border transition-all duration-200 ${
            !isSubscription
              ? 'border-primary/60 bg-primary/[0.03]'
              : 'border-border/50 hover:border-primary/20'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                !isSubscription ? 'border-primary' : 'border-border'
              }`}
            >
              {!isSubscription && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
            <div className="text-[11px] uppercase tracking-widest font-medium">{oneTimeLabel}</div>
          </div>
          <span className="text-sm font-medium">${oneTimePrice}.00</span>
        </button>
      </div>

      {/* Quantity + Add to Cart */}
      <div className="space-y-3">
        <p className="text-[9px] uppercase tracking-widest text-primary/35">{quantityLabel}</p>
        <div className="flex gap-3">
          <div className="flex items-center border border-border/60">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
            >
              <Minus size={13} />
            </button>
            <span className="w-9 text-center text-sm tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-12 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          <AddToCart
            product={product}
            quantity={quantity}
            className="flex-1 h-12 bg-primary text-primary-foreground text-[11px] uppercase tracking-widest hover:bg-primary/88 active:scale-[0.99] transition-all flex items-center justify-center"
            label={`Add to Cart — $${(displayPrice * quantity).toFixed(2)}`}
          />
        </div>

        <button className="w-full h-11 border border-primary/25 text-primary text-[11px] uppercase tracking-widest hover:border-primary/50 transition-colors">
          {buyNowLabel}
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3 border-t border-border/40 pt-6">
        {trustBadges.map((badge) => (
          <Badge key={badge.slug} label={badge.label} />
        ))}
      </div>

      {shippingText && (
        <p className="text-[10px] text-primary/30 leading-relaxed">
          {shippingText}
        </p>
      )}

      {/* INGREDIENTS */}
      <div className="border-t border-border/40 pt-6">
        <button
          onClick={() => setIngredientsOpen(!ingredientsOpen)}
          className="w-full grid grid-cols-[1fr_auto] items-center gap-6 py-4 text-left group"
        >
          <span className="font-serif italic text-xl md:text-2xl text-primary group-hover:text-primary/70 transition-colors">
            {ingredientsHeading}
          </span>
          <motion.span
            animate={{ rotate: ingredientsOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-primary/30 group-hover:text-primary/50 transition-colors"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence>
          {ingredientsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-6 border-t border-border/40 pt-4">
                {ingredients.map((ing) => (
                  <div
                    key={ing.slug}
                    className="flex justify-between items-center py-3 border-b border-border/30"
                  >
                    <span className="text-sm text-primary/70 font-light">{ing.name}</span>
                    <span className="text-[11px] text-primary/40 uppercase tracking-widest tabular-nums shrink-0 ml-4">
                      {ing.dose}
                    </span>
                  </div>
                ))}
              </div>
              {otherIngredientsText && (
                <p className="text-[10px] text-primary/30 leading-relaxed pb-4">
                  {otherIngredientsText}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAQ */}
      <div className="border-t border-border/40 pt-6">
        <p className="text-[10px] uppercase tracking-widest text-primary/35 mb-4">{faqLabel}</p>
        <h2 className="font-serif italic text-2xl text-primary leading-snug mb-6">
          {faqHeading}
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={faq.slug}
              q={faq.question}
              a={faq.answer}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function Badge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-primary/45">
      <div className="w-3.5 h-3.5 border border-primary/20 flex items-center justify-center shrink-0">
        <div className="w-1 h-1 bg-accent" />
      </div>
      {label}
    </div>
  )
}

function AccordionItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-border/60">
      <button
        onClick={onToggle}
        className="w-full py-4 flex justify-between items-center text-left gap-6 group"
      >
        <span className="text-[11px] uppercase tracking-widest font-medium group-hover:text-primary/70 transition-colors">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-primary/35"
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-primary/55 font-light leading-[1.85]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
