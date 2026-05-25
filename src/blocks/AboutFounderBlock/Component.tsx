"use client";

import { m } from "framer-motion";

import { GrainOverlay } from "@/components/viality";
import type { AboutFounderBlock } from "@/payload-types";

export const AboutFounderBlockComponent: React.FC<
  AboutFounderBlock & { id?: string }
> = ({ label, quote, signature }) => {
  return (
    <section className="bg-ink py-28 md:py-36 px-6 md:px-16 relative overflow-hidden">
      <GrainOverlay opacity={0.055} />
      <div className="absolute inset-0 pointer-events-none bg-founder-glow" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <m.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-widest text-primary-foreground/30 mb-10"
        >
          {label || "A Note from the Founders"}
        </m.p>
        <m.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif italic text-primary-foreground/90 leading-[1.65] mb-14"
          style={{ fontSize: "clamp(1.3rem, 3vw, 2.1rem)" }}
        >
          {quote}
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
            {signature || "The viality Team"}
          </p>
        </m.div>
      </div>
    </section>
  );
};
