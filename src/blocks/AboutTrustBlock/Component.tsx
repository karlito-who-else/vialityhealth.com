"use client";

import { m } from "framer-motion";

import type { AboutTrustBlock, TrustItem } from "@/payload-types";

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

export const AboutTrustBlockComponent: React.FC<
  AboutTrustBlock & { id?: string }
> = ({ label, heading, body, imageLabel, buttonLabel, items: rawItems }) => {
  const items = (rawItems || []).filter(
    (t): t is TrustItem => typeof t === "object" && t !== null,
  );

  return (
    <section className="bg-background py-28 md:py-36 px-6 md:px-16">
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-start">
          <m.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="md:sticky md:top-28"
          >
            <div className="aspect-[3/4] bg-surface-placeholder relative overflow-hidden flex items-center justify-center">
              <span className="text-primary/20 font-serif italic text-8xl tracking-wider">v</span>
              <div className="absolute bottom-5 left-5 z-10">
                <p className="text-xs uppercase tracking-widest text-primary/35">
                  {imageLabel || "Third-Party Verified"}
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
                {label || "Our Standards"}
              </m.p>
              <m.h2
                variants={fadeUp}
                custom={0}
                className="font-serif italic text-4xl text-primary leading-snug mb-4"
              >
                {(heading || "The science is visible.\nBy design.").split("\n").map((line, i) => (
                  <span key={`trust-line-${i}`}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </m.h2>
              {body && (
                <m.p
                  variants={fadeUp}
                  custom={0.1}
                  className="text-primary/55 text-sm leading-relaxed font-light"
                >
                  {body}
                </m.p>
              )}
            </m.div>

            {items.map((item, i) => (
              <m.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" as const }}
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
              <button
                type="button"
                className="mt-2 text-xs uppercase tracking-widest border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
              >
                {buttonLabel || "Request Certificate of Analysis"}
              </button>
            </m.div>
          </div>
        </div>
      </div>
    </section>
  );
};
