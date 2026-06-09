"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import type { Faq, FaqBlock } from "@/payload-types";

export const FaqBlockComponent: React.FC<FaqBlock & { id?: string }> = ({
  heading,
  body,
  items: rawItems,
}) => {
  const items = (rawItems || []).filter(
    (f): f is Faq => typeof f === "object" && f !== null,
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-surface-section py-12 md:py-24 px-6 md:px-16">
      <div className="max-w-180 mx-auto">
        {heading && (
          <h2 className="font-serif uppercase font-light text-3xl md:text-4xl text-primary mb-3">
            {heading}
          </h2>
        )}
        {body && (
          <p className="text-sm text-primary/55 font-light leading-[1.85] mb-10 max-w-140">
            {body}
          </p>
        )}
        <div>
          {items.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.slug} className="border-b border-border/60">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="w-full py-4 flex justify-between items-center text-left gap-6 group"
                >
                  <span className="text-xs uppercase tracking-widest font-medium group-hover:text-primary/70 transition-colors">
                    {faq.question}
                  </span>
                  <m.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-primary/35"
                  >
                    <ChevronDown size={14} />
                  </m.span>
                </button>
                <AnimatePresence>
                  {open && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 text-sm text-primary/55 font-light leading-[1.85] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
