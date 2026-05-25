"use client";

import { m } from "framer-motion";

import { Link } from "@/components/atoms/Link";
import type { AboutCtaBlock } from "@/payload-types";

export const AboutCtaBlockComponent: React.FC<AboutCtaBlock & { id?: string }> = ({
  heading,
  body,
  shopLabel,
  shopLink,
  labLabel,
  complianceText,
}) => {
  return (
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
            {(heading || "Designed for\nconsistency.").split("\n").map((line, i) => (
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
          {body && (
            <p className="text-primary/60 text-sm leading-relaxed font-light max-w-sm">{body}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={shopLink || "/shop"}
              className="inline-block px-9 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 transition-colors"
            >
              {shopLabel || "Shop Formulas"}
            </Link>
            <button
              type="button"
              className="inline-block px-9 py-4 border border-primary/25 text-primary text-xs uppercase tracking-widest hover:border-primary transition-colors"
            >
              {labLabel || "View Lab Reports"}
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
  );
};
