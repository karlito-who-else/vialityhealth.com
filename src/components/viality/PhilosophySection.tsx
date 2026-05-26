"use client";

import { Link } from "@/components/atoms/Link";
import { LazyMotion, domAnimation, m } from "framer-motion";

import { resolveLinkHref } from "@/utilities/resolveLinkHref";

export type PhilosophySectionProps = {
  body?: string | null;
  link?: {
    type?: ("reference" | "custom") | null;
    newTab?: boolean | null;
    reference?: {
      relationTo: "pages";
      value: unknown;
    } | null;
    url?: string | null;
    label: string;
  } | null;
};

export function PhilosophySection({ body, link }: PhilosophySectionProps) {
  const href = link ? resolveLinkHref(link) : null;

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-36 px-6 bg-background" data-component="PhilosophySection">
        <div className="max-w-4xl mx-auto text-center">
          {body && (
            <m.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9 }}
              className="font-serif text-2xl md:text-4xl leading-relaxed text-primary/90"
            >
              {body}
            </m.p>
          )}
          {href && (
            <m.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-12"
            >
              <Link
                href={href}
                className="inline-block border-b border-primary/30 pb-1 text-xs uppercase tracking-widest hover:border-primary transition-colors"
              >
                {link?.label}
              </Link>
            </m.div>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
