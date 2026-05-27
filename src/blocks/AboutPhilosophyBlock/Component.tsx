"use client";

import { m } from "framer-motion";

import type { AboutPhilosophyBlock, Media } from "@/payload-types";
import Image from "next/image";

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

export const AboutPhilosophyBlockComponent: React.FC<
  AboutPhilosophyBlock & { id?: string }
> = ({ label, heading, body, image, imageLabel }) => {
  const media = image && typeof image === "object" ? image as Media : null;

  return (
    <section className="bg-background py-28 md:py-36 px-6 md:px-16">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        <m.div
          className="max-w-lg mx-auto text-balance"
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
            {label || "Brand Philosophy"}
          </m.p>
          <m.h2
            variants={fadeUp}
            custom={0}
            className="font-serif italic text-3xl md:text-4xl text-primary mb-8 leading-snug"
          >
            {heading || "Where science meets ritual — and neither is allowed to compromise the other."}
          </m.h2>
          <m.div
            variants={fadeUp}
            custom={0.1}
            className="space-y-5 text-primary/60 text-sm leading-[1.85] font-light"
          >
            {body?.map((item) => (
              <p key={item.id}>{item.paragraph}</p>
            ))}
          </m.div>
        </m.div>

        <m.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          <div className="aspect-3/4 bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
            {media?.url ? (
              <Image
                src={media.url}
                alt={media.alt || imageLabel || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
            )}
            <div className="absolute bottom-5 left-5 z-10">
              <p className="text-xs uppercase tracking-widest text-primary/35">
                {imageLabel || "viality — signature formula"}
              </p>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
};
