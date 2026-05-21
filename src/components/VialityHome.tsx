'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { TrustItem, ShippingInfo, FeaturedProduct, Home } from '@/payload-types'

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        mixBlendMode: 'multiply',
      }}
    />
  )
}

function VideoPanel({ src }: { src: string }) {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#111]">
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(10,8,6,0.28) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(10,8,6,0.52) 0%, transparent 100%)" }}
      />
    </div>
  )
}

export function VialityHome({ trustItems, shippingItems, featuredProducts, home }: { trustItems: TrustItem[]; shippingItems: ShippingInfo[]; featuredProducts: FeaturedProduct[]; home: Home }) {
  const heroTagline = home?.heroTagline || 'Wellness, refined.'
  const heroTitle = home?.heroTitle || 'viality'
  const heroSubtext = home?.heroSubtext || 'Where science meets ritual.'
  const heroCTALabel = home?.heroCTALabel || 'Begin the Ritual'
  const heroCTALink = home?.heroCTALink || '/shop'
  const heroSecondaryLabel = home?.heroSecondaryLabel || 'Our Philosophy'
  const heroSecondaryLink = home?.heroSecondaryLink || '/about'
  const heroScrollLabel = home?.heroScrollLabel || 'Scroll'
  const philosophyBody = home?.philosophyBody || ''
  const philosophyLinkLabel = home?.philosophyLinkLabel || 'Our Story'
  const philosophyLink = home?.philosophyLink || '/about'
  const collectionHeading = home?.collectionHeading || 'The Collection'
  const shopAllLabel = home?.shopAllLabel || 'Shop All'
  const trustHeading = home?.trustHeading || 'A quieter standard of vitality.'
  const trustBody = home?.trustBody || ''
  const trustCTALabel = home?.trustCTALabel || 'View Lab Reports'
  const trustCTALink = home?.trustCTALink || '/about'
  const waitlistHeading = home?.waitlistHeading || 'Begin your daily reset.'
  const waitlistBody = home?.waitlistBody || ''
  const waitlistPlaceholder = home?.waitlistPlaceholder || 'YOUR EMAIL ADDRESS'
  const waitlistButtonLabel = home?.waitlistButtonLabel || 'Join Waitlist'
  const complianceText = home?.complianceText || ''

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="hidden md:flex w-full h-full">
            <VideoPanel src="/helix2.mp4" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-px bg-white/20 z-10" />
            <VideoPanel src="/helix.mp4" />
          </div>
          <div className="md:hidden absolute inset-0 bg-[#111]">
            <video
              src="/helix2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(10,8,6,0.35) 100%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(10,8,6,0.55) 0%, transparent 100%)",
              }}
            />
          </div>
        </div>

        <GrainOverlay />

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#8A8A8A",
            }}
            className="mb-8"
          >
            {heroTagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontWeight: 700,
              fontSize: "clamp(34px, 4vw, 64px)",
              lineHeight: 0.96,
              letterSpacing: "-0.04em",
              color: "#1E1E1E",
            }}
          >
            {heroTitle}
          </motion.h1>

          {heroSubtext && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 1, ease: "easeOut" }}
              className="mt-5 max-w-xs"
              style={{
                fontFamily: '"Helvetica Neue", sans-serif',
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: 1.8,
                letterSpacing: "-0.01em",
                color: "#6F6F6F",
                textTransform: "lowercase",
              }}
            >
              {heroSubtext}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link
              href={heroCTALink}
              className="px-9 py-3.5 bg-white text-[#1c1916] text-[11px] uppercase tracking-[0.22em] hover:bg-white/90 active:bg-white/80 transition-colors duration-200"
            >
              {heroCTALabel}
            </Link>
            <Link
              href={heroSecondaryLink}
              className="px-9 py-3.5 border border-white/50 text-white text-[11px] uppercase tracking-[0.22em] hover:border-white hover:bg-white/8 transition-all duration-200"
            >
              {heroSecondaryLabel}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-white/30"
          />
          <span className="text-white/30 text-[9px] uppercase tracking-[0.25em]">{heroScrollLabel}</span>
        </motion.div>
      </section>

      {/* BRAND PHILOSOPHY */}
      <section className="py-36 px-6 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          {philosophyBody && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
              className="font-serif text-2xl md:text-4xl leading-relaxed text-primary/90"
            >
              {philosophyBody}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12"
          >
            <Link
              href={philosophyLink}
              className="inline-block border-b border-primary/30 pb-1 text-[11px] uppercase tracking-[0.2em] hover:border-primary transition-colors"
            >
              {philosophyLinkLabel}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 px-6 bg-[#f7f5f0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-serif italic text-4xl text-primary">{collectionHeading}</h2>
            <Link
              href="/shop"
              className="text-[11px] uppercase tracking-[0.2em] hidden md:inline-block border-b border-transparent hover:border-primary/30 pb-1 transition-colors"
            >
              {shopAllLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href="/shop">
                  <div className="aspect-[3/4] mb-6 bg-[#eae6de] relative overflow-hidden flex items-center justify-center">
                    <div className="text-primary/20 font-serif italic text-6xl tracking-wider">v</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <h3 className="uppercase tracking-[0.18em] text-xs font-medium">{product.name}</h3>
                      <span className="text-sm font-light">{product.price}</span>
                    </div>
                    <p className="text-primary/55 text-sm">{product.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href="/shop"
              className="inline-block border-b border-primary/30 pb-1 text-[11px] uppercase tracking-[0.2em]"
            >
              {shopAllLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST / TRANSPARENCY */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 grid grid-cols-2 gap-x-8 gap-y-12">
            {trustItems.map((item, i) => (
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
            <h2 className="font-serif italic text-4xl mb-6">{trustHeading}</h2>
            {trustBody && (
              <p className="text-primary/65 mb-10 leading-relaxed max-w-md">
                {trustBody}
              </p>
            )}
            <Link
              href={trustCTALink}
              className="px-8 py-4 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.2em] hover:bg-primary/88 transition-colors inline-block"
            >
              {trustCTALabel}
            </Link>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="py-32 px-6 bg-primary text-primary-foreground text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif italic text-4xl mb-4"
          >
            {waitlistHeading}
          </motion.h2>
          {waitlistBody && (
            <p className="text-primary-foreground/65 mb-10 text-sm max-w-md leading-relaxed">
              {waitlistBody}
            </p>
          )}
          <form className="w-full flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="email"
              placeholder={waitlistPlaceholder}
              className="flex-1 bg-transparent border-b border-primary-foreground/25 px-4 py-3 text-[11px] focus:outline-none focus:border-accent placeholder:text-primary-foreground/30 uppercase tracking-[0.18em] transition-colors"
              required
            />
            <button
              type="button"
              className="px-8 py-3 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.2em] hover:bg-accent/88 transition-colors"
            >
              {waitlistButtonLabel}
            </button>
          </form>
        </div>
      </section>

      {/* SHIPPING + LAB CALLOUTS */}
      <section className="py-16 px-6 bg-[#f2efea] border-t border-border/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {shippingItems.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold">{item.label}</p>
              <p className="text-xs text-primary/50">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance */}
      {complianceText && (
        <section className="py-8 px-6 bg-background border-t border-border/20">
          <p className="max-w-4xl mx-auto text-center text-[10px] text-primary/35 leading-relaxed tracking-wide">
            {complianceText}
          </p>
        </section>
      )}
    </div>
  )
}
