"use client";

import { m } from "framer-motion";

import type { AboutPrinciplesBlock, Principle } from "@/payload-types";

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

export const AboutPrinciplesBlockComponent: React.FC<
  AboutPrinciplesBlock & { id?: string }
> = ({ label, heading, items: rawItems }) => {
  const items = (rawItems || []).filter(
    (p): p is Principle => typeof p === "object" && p !== null,
  );

  return (
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
            {label || "What We Stand For"}
          </m.p>
          <m.h2
            variants={fadeUp}
            custom={0}
            className="font-serif italic text-4xl md:text-5xl text-primary"
          >
            {(heading || "Three principles.\nNo exceptions.").split("\n").map((line, i) => (
              <span key={`principles-line-${i}`}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </m.h2>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {items.map((principle, i) => (
            <m.div
              key={principle.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] as const }}
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
  );
};
