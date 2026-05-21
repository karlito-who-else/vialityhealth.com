'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { useRef } from 'react'
import type { Principle, TrustItem } from '@/payload-types'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay } as any,
  }),
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: 'easeOut', delay } as any,
  }),
}

function GrainOverlay({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
        mixBlendMode: 'multiply',
      }}
    />
  )
}

export function VialityAbout({ principles, trustItems }: { principles: Principle[]; trustItems: TrustItem[] }) {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* 1. EDITORIAL HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 overflow-hidden"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(160deg, #e6e0d6 0%, #d8d0c4 35%, #cac3b8 65%, #d2cdc5 100%)',
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 65% 60% at 25% 70%, rgba(195,183,166,0.8) 0%, transparent 65%)',
            }}
            animate={{ x: [0, 20, -14, 0], y: [0, -16, 20, 0] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 55% at 78% 30%, rgba(210,205,198,0.6) 0%, transparent 60%)',
            }}
            animate={{ x: [0, -18, 12, 0], y: [0, 22, -12, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(20,18,14,0.5) 0%, rgba(20,18,14,0.1) 40%, transparent 100%)',
            }}
          />
          <GrainOverlay opacity={0.04} />
        </motion.div>

        <div className="relative z-10 max-w-[1200px] mx-auto w-full">
          <motion.p
            variants={fadeIn}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-8"
          >
            Our Philosophy
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="font-serif italic text-white leading-[1.05] mb-8"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 6.5rem)' }}
          >
            Wellness, refined.<br className="hidden md:block" /> A quieter standard.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
            className="text-white/65 text-sm md:text-base font-light leading-relaxed max-w-xl"
          >
            Modern rituals for internal balance — for those who understand that how you care for yourself is a reflection of how you live.
          </motion.p>
        </div>
      </section>

      {/* 2. SPLIT TEXT / IMAGE */}
      <section className="bg-background py-28 md:py-36 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.p
              variants={fadeIn}
              custom={0}
              className="text-[10px] uppercase tracking-[0.3em] text-primary/40 mb-8"
            >
              Brand Philosophy
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-serif italic text-3xl md:text-4xl text-primary mb-8 leading-snug"
            >
              Where science meets ritual — and neither is allowed to compromise the other.
            </motion.h2>
            <motion.div variants={fadeUp} custom={0.1} className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light">
              <p>
                viality was built on one conviction: the things we bring into our bodies deserve the same scrutiny and care as everything else we consider important. We work with precision, not promise.
              </p>
              <p>
                We occupy a quieter corner of the wellness world — one where claims are measured, ingredients are disclosed, and the ritual of taking care of yourself is treated with the seriousness it deserves. No noise. No theatre.
              </p>
              <p>
                Designed for consistency. Every formulation is meant to be used daily, over time, as part of a considered routine — not as a quick fix or a seasonal experiment.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="aspect-[3/4] bg-[#eae6de] relative overflow-hidden flex items-center justify-center">
              <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
              <div
                className="absolute bottom-5 left-5 z-10"
              >
                <p className="text-[9px] uppercase tracking-[0.25em] text-primary/35">viality — signature formula</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. THREE PILLARS */}
      <section className="bg-[#f2efea] py-28 md:py-36 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="mb-20"
          >
            <motion.p variants={fadeIn} custom={0} className="text-[10px] uppercase tracking-[0.3em] text-primary/40 mb-5">
              What We Stand For
            </motion.p>
            <motion.h2 variants={fadeUp} custom={0} className="font-serif italic text-4xl md:text-5xl text-primary">
              Three principles.<br />No exceptions.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {principles.map((principle, i) => (
              <motion.div
                key={principle.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col"
              >
                <div className="flex items-start gap-6 mb-8 pb-8 border-b border-primary/10">
                  <span className="font-serif italic text-5xl text-primary/12 leading-none select-none">
                    {principle.displayNumber}
                  </span>
                  <h3 className="font-serif italic text-3xl text-primary leading-none mt-1">
                    {principle.title}
                  </h3>
                </div>
                <p className="text-primary/55 text-sm leading-[1.9] font-light">{principle.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SCIENCE / TRUST */}
      <section className="bg-background py-28 md:py-36 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:sticky md:top-28"
            >
              <div className="aspect-[3/4] bg-[#eae6de] relative overflow-hidden flex items-center justify-center">
                <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
                <div className="absolute bottom-5 left-5 z-10">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-primary/35">Third-Party Verified</p>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-14">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              >
                <motion.p variants={fadeIn} custom={0} className="text-[10px] uppercase tracking-[0.3em] text-primary/40 mb-6">
                  Our Standards
                </motion.p>
                <motion.h2 variants={fadeUp} custom={0} className="font-serif italic text-4xl text-primary leading-snug mb-4">
                  The science is visible.<br />By design.
                </motion.h2>
                <motion.p variants={fadeUp} custom={0.1} className="text-primary/55 text-sm leading-relaxed font-light">
                  We operate with complete openness. Nothing is hidden behind proprietary blends
                  or ambiguous quantities. Every claim we make is verifiable.
                </motion.p>
              </motion.div>

              {trustItems.map((item, i) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                  className="border-t border-primary/10 pt-8"
                >
                  <h4 className="text-[11px] uppercase tracking-[0.22em] font-semibold mb-3">{item.title}</h4>
                  <p className="text-primary/55 text-sm leading-[1.85] font-light">{item.description}</p>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <button
                  className="mt-2 text-[11px] uppercase tracking-[0.22em] border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
                >
                  Request Certificate of Analysis
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOUNDER / BRAND NOTE */}
      <section className="bg-[#1c1916] py-28 md:py-36 px-6 md:px-16 relative overflow-hidden">
        <GrainOverlay opacity={0.055} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(180,160,130,0.07) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-10"
          >
            A Note from the Founders
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif italic text-white/90 leading-[1.65] mb-14"
            style={{ fontSize: 'clamp(1.3rem, 3vw, 2.1rem)' }}
          >
            "We built viality because we were tired of choosing between what works and what feels worthy of the care we put into ourselves. Modern rituals for internal balance shouldn't require compromise. That conviction is built into every decision we make — from the compounds we select to the language we use to describe them."
          </motion.blockquote>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-px bg-white/20 mb-5" />
            <p className="text-white/50 text-[11px] uppercase tracking-[0.22em]">The viality Team</p>
          </motion.div>
        </div>
      </section>

      {/* 6. CLOSING CTA */}
      <section className="bg-[#f2efea] py-28 md:py-36 px-6 md:px-16">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2
              className="font-serif italic text-primary leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              Designed for<br />consistency.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-6"
          >
            <p className="text-primary/60 text-sm leading-relaxed font-light max-w-sm">
              Where science meets ritual. Formulations built to be used daily, for the long term — with complete transparency about everything inside them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-block px-9 py-4 bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.22em] hover:bg-primary/88 transition-colors"
              >
                Shop Formulas
              </Link>
              <button
                className="inline-block px-9 py-4 border border-primary/25 text-primary text-[11px] uppercase tracking-[0.22em] hover:border-primary transition-colors"
              >
                View Lab Reports
              </button>
            </div>
            <p className="text-[10px] text-primary/30 leading-relaxed max-w-sm mt-2">
              These statements have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
