'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GrainOverlay } from './GrainOverlay'
import { VideoPanel } from './VideoPanel'

export type HeroSectionProps = {
  tagline: string
  title: string
  subtext?: string | null
  ctaLabel: string
  ctaLink: string
  secondaryLabel?: string | null
  secondaryLink?: string | null
  scrollLabel: string
}

export function HeroSection({
  tagline,
  title,
  subtext,
  ctaLabel,
  ctaLink,
  secondaryLabel,
  secondaryLink,
  scrollLabel,
}: HeroSectionProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 flex">
        <div className="hidden md:flex w-full h-full">
          <VideoPanel src="/helix2.mp4" />
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-px bg-white/20 z-10" />
          <VideoPanel src="/helix.mp4" />
        </div>
          <div className="md:hidden absolute inset-0 bg-ink-well">
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
                "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, var(--color-video-overlay) 100%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
            style={{
              background: "linear-gradient(to top, var(--color-video-overlay-strong) 0%, transparent 100%)",
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
            color: "var(--color-muted-foreground)",
          }}
          className="mb-8"
        >
          {tagline}
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
            color: "var(--color-foreground)",
          }}
        >
          {title}
        </motion.h1>

        {subtext && (
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
              color: "var(--color-muted-foreground)",
              textTransform: "lowercase",
            }}
          >
            {subtext}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href={ctaLink}
            className="px-9 py-3.5 bg-primary-foreground text-ink text-[11px] uppercase tracking-[0.22em] hover:bg-primary-foreground/90 active:bg-primary-foreground/80 transition-colors duration-200"
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryLink && (
            <Link
              href={secondaryLink}
              className="px-9 py-3.5 border border-primary-foreground/50 text-primary-foreground text-[11px] uppercase tracking-[0.22em] hover:border-primary-foreground hover:bg-primary-foreground/8 transition-all duration-200"
            >
              {secondaryLabel}
            </Link>
          )}
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
          className="w-px h-10 bg-primary-foreground/30"
        />
        <span className="text-primary-foreground/30 text-[9px] uppercase tracking-[0.25em]">{scrollLabel}</span>
      </motion.div>
    </section>
  )
}
