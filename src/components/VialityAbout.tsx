"use client";

import { Link } from "@/components/atoms/Link";
import { LazyMotion, domAnimation, m, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

import type { About, Principle, TrustItem } from "@/payload-types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay } as any,
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: "easeOut", delay } as any,
  }),
};

function GrainOverlay({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
        mixBlendMode: "multiply",
      }}
    />
  );
}

export function VialityAbout({
  principles,
  trustItems,
  about,
}: {
  principles: Principle[];
  trustItems: TrustItem[];
  about: About;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const heroLabel = about?.heroLabel || "Our Philosophy";
  const heroHeading = about?.heroHeading || "Wellness, refined.\nA quieter standard.";
  const heroBody = about?.heroBody || "";
  const philosophyLabel = about?.philosophyLabel || "Brand Philosophy";
  const philosophyHeading = about?.philosophyHeading || "";
  const philosophyBody = about?.philosophyBody || [];
  const philosophyImageLabel = about?.philosophyImageLabel || "viality — signature formula";
  const principlesLabel = about?.principlesLabel || "What We Stand For";
  const principlesHeading = about?.principlesHeading || "Three principles.\nNo exceptions.";
  const trustLabel = about?.trustLabel || "Our Standards";
  const trustHeading = about?.trustHeading || "The science is visible.\nBy design.";
  const trustBody = about?.trustBody || "";
  const trustImageLabel = about?.trustImageLabel || "Third-Party Verified";
  const trustButtonLabel = about?.trustButtonLabel || "Request Certificate of Analysis";
  const founderLabel = about?.founderLabel || "A Note from the Founders";
  const founderQuote = about?.founderQuote || "";
  const founderSignature = about?.founderSignature || "The viality Team";
  const ctaHeading = about?.ctaHeading || "Designed for\nconsistency.";
  const ctaBody = about?.ctaBody || "";
  const ctaShopLabel = about?.ctaShopLabel || "Shop Formulas";
  const ctaLabLabel = about?.ctaLabLabel || "View Lab Reports";
  const complianceText = about?.complianceText || "";

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-background overflow-hidden">
        {/* 1. EDITORIAL HERO */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 overflow-hidden"
          data-component="VitalityAbout"
        >
          <m.div className="absolute inset-0" style={{ y: heroY }}>
            <div
              className="absolute inset-0 bg-hero-gradient"
            />
            <m.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 65% 60% at 25% 70%, oklch(76% 0.042 78deg / 0.8) 0%, transparent 65%)",
              }}
              animate={{ x: [0, 20, -14, 0], y: [0, -16, 20, 0] }}
              transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 50% 55% at 78% 30%, oklch(82% 0.02 81deg / 0.6) 0%, transparent 60%)",
              }}
              animate={{ x: [0, -18, 12, 0], y: [0, 22, -12, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />
            <div
              className="absolute inset-0 bg-hero-fade"
            />
            <GrainOverlay opacity={0.04} />
          </m.div>

          <div className="relative z-10 mx-auto container">
            <m.p
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={0.3}
              className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-8"
            >
              {heroLabel}
            </m.p>

            <m.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
              className="font-serif italic text-primary-foreground leading-[1.05] mb-8"
              style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
            >
              {heroHeading.split("\n").map((line, i) => (
                <span key={`hero-line-${i}`}>
                  {i > 0 && <br className="hidden md:block" />}
                  {line}
                </span>
              ))}
            </m.h1>

            {heroBody && (
              <m.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.35}
                className="text-primary-foreground/65 text-sm md:text-base font-light leading-relaxed max-w-xl"
              >
                {heroBody}
              </m.p>
            )}
          </div>
        </section>

        {/* 2. SPLIT TEXT / IMAGE */}
        <section className="bg-background py-28 md:py-36 px-6 md:px-16">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
            >
              <m.p
                variants={fadeIn}
                custom={0}
                className="text-xs uppercase tracking-widest text-primary/40 mb-8"
              >
                {philosophyLabel}
              </m.p>
              <m.h2
                variants={fadeUp}
                custom={0}
                className="font-serif italic text-3xl md:text-4xl text-primary mb-8 leading-snug"
              >
                {philosophyHeading}
              </m.h2>
              <m.div
                variants={fadeUp}
                custom={0.1}
                className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light"
              >
                {philosophyBody.map((item) => (
                  <p key={item.id}>{item.paragraph}</p>
                ))}
              </m.div>
            </m.div>

            <m.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="aspect-3/4 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
                <div className="absolute bottom-5 left-5 z-10">
                  <p className="text-xs uppercase tracking-widest text-primary/35">
                    {philosophyImageLabel}
                  </p>
                </div>
              </div>
            </m.div>
          </div>
        </section>

        {/* 3. THREE PILLARS */}
        <section className="bg-surface-section py-28 md:py-36 px-6 md:px-16">
          <div className="max-w-300 mx-auto">
            <m.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
              className="mb-20"
            >
              <m.p
                variants={fadeIn}
                custom={0}
                className="text-xs uppercase tracking-widest text-primary/40 mb-5"
              >
                {principlesLabel}
              </m.p>
              <m.h2
                variants={fadeUp}
                custom={0}
                className="font-serif italic text-4xl md:text-5xl text-primary"
              >
                {principlesHeading.split("\n").map((line, i) => (
                  <span key={`principles-line-${i}`}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </m.h2>
            </m.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {principles.map((principle, i) => (
                <m.div
                  key={principle.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
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
                </m.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. SCIENCE / TRUST */}
        <section className="bg-background py-28 md:py-36 px-6 md:px-16">
          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
              <m.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="md:sticky md:top-28"
              >
                <div className="aspect-[3/4] bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
                  <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
                  <div className="absolute bottom-5 left-5 z-10">
                    <p className="text-xs uppercase tracking-widest text-primary/35">
                      {trustImageLabel}
                    </p>
                  </div>
                </div>
              </m.div>

              <div className="flex flex-col gap-14">
                <m.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
                >
                  <m.p
                    variants={fadeIn}
                    custom={0}
                    className="text-xs uppercase tracking-widest text-primary/40 mb-6"
                  >
                    {trustLabel}
                  </m.p>
                  <m.h2
                    variants={fadeUp}
                    custom={0}
                    className="font-serif italic text-4xl text-primary leading-snug mb-4"
                  >
                    {trustHeading.split("\n").map((line, i) => (
                      <span key={`trust-line-${i}`}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </m.h2>
                  {trustBody && (
                    <m.p
                      variants={fadeUp}
                      custom={0.1}
                      className="text-primary/55 text-sm leading-relaxed font-light"
                    >
                      {trustBody}
                    </m.p>
                  )}
                </m.div>

                {trustItems.map((item, i) => (
                  <m.div
                    key={item.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                    className="border-t border-primary/10 pt-8"
                  >
                    <h4 className="text-xs uppercase tracking-widest font-semibold mb-3">
                      {item.title}
                    </h4>
                    <p className="text-primary/55 text-sm leading-[1.85] font-light">
                      {item.description}
                    </p>
                  </m.div>
                ))}

                <m.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <button type="button" className="mt-2 text-xs uppercase tracking-widest border-b border-primary/30 pb-0.5 hover:border-primary transition-colors">
                    {trustButtonLabel}
                  </button>
                </m.div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. FOUNDER / BRAND NOTE */}
        <section className="bg-ink py-28 md:py-36 px-6 md:px-16 relative overflow-hidden">
          <GrainOverlay opacity={0.055} />
          <div
            className="absolute inset-0 pointer-events-none bg-founder-glow"
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <m.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-xs uppercase tracking-widest text-primary-foreground/30 mb-10"
            >
              {founderLabel}
            </m.p>
            <m.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif italic text-primary-foreground/90 leading-[1.65] mb-14"
              style={{ fontSize: "clamp(1.3rem, 3vw, 2.1rem)" }}
            >
              {founderQuote}
            </m.blockquote>
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-10 h-px bg-primary-foreground/20 mb-5" />
              <p className="text-primary-foreground/50 text-xs uppercase tracking-widest">
                {founderSignature}
              </p>
            </m.div>
          </div>
        </section>

        {/* 6. CLOSING CTA */}
        <section className="bg-surface-section py-28 md:py-36 px-6 md:px-16">
          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h2
                className="font-serif italic text-primary leading-tight"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
              >
                {ctaHeading.split("\n").map((line, i) => (
                  <span key={`cta-line-${i}`}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h2>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col gap-6"
            >
              {ctaBody && (
                <p className="text-primary/60 text-sm leading-relaxed font-light max-w-sm">
                  {ctaBody}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-block px-9 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 transition-colors"
                >
                  {ctaShopLabel}
                </Link>
                <button type="button" className="inline-block px-9 py-4 border border-primary/25 text-primary text-xs uppercase tracking-widest hover:border-primary transition-colors">
                  {ctaLabLabel}
                </button>
              </div>
              {complianceText && (
                <p className="text-xs text-primary/30 leading-relaxed max-w-sm mt-2">
                  {complianceText}
                </p>
              )}
            </m.div>
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
