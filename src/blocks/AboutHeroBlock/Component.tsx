"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import type { AboutHeroBlock } from "@/payload-types";

import { GrainOverlay } from "@/components/viality";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] as const, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" as const, delay },
  }),
};

export const AboutHeroBlockComponent: React.FC<
  AboutHeroBlock & { id?: string }
> = ({ label, heading, body }) => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-end pb-20 md:pb-28 px-6 md:px-16 overflow-hidden"
    >
      <m.div className="absolute inset-0" style={{ y: heroY }}>
        <div className="absolute inset-0 bg-hero-gradient" />
        <m.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 60% at 25% 70%, oklch(76% 0.042 78deg / 0.8) 0%, transparent 65%)",
          }}
          animate={{ x: [0, 20, -14, 0], y: [0, -16, 20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" as const }}
        />
        <m.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 78% 30%, oklch(82% 0.02 81deg / 0.6) 0%, transparent 60%)",
          }}
          animate={{ x: [0, -18, 12, 0], y: [0, 22, -12, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" as const, delay: 3 }}
        />
        <div className="absolute inset-0 bg-hero-fade" />
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
          {label || "Our Philosophy"}
        </m.p>

        <m.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="font-serif text-primary-foreground leading-[1.05] mb-8"
          style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
        >
          {(heading || "Wellness, refined.\nA quieter standard.").split("\n").map((line, i) => (
            <span key={`hero-line-${i}`}>
              {i > 0 && <br className="hidden md:block" />}
              {line}
            </span>
          ))}
        </m.h1>

        {body && (
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
            className="text-primary-foreground/65 text-sm md:text-base font-light leading-relaxed max-w-xl"
          >
            {body}
          </m.p>
        )}
      </div>
    </section>
  );
};
