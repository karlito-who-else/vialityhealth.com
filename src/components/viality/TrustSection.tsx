"use client";

import { Link } from "@/components/atoms/Link";
import { LazyMotion, domAnimation, m } from "framer-motion";

import { resolveLinkHref } from "@/utilities/resolveLinkHref";

import type { TrustItem } from "@/payload-types";

export type TrustSectionProps = {
  heading: string;
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
  items: TrustItem[];
};

export function TrustSection({ heading, body, link, items }: TrustSectionProps) {
  const href = link ? resolveLinkHref(link) : null;

  return (
    <LazyMotion features={domAnimation}>
      <section className="py-24 px-6 bg-background" data-component="TrustSection">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 grid grid-cols-2 gap-x-8 gap-y-12">
            {items.map((item, i) => (
              <m.div
                key={item.slug}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-3"
              >
                <div className="size-7 border border-primary/15 flex items-center justify-center mb-2">
                  <div className="size-1.5 bg-accent" />
                </div>
                <h4 className="text-xs uppercase tracking-widest font-semibold">{item.title}</h4>
                <p className="text-sm text-primary/55 leading-relaxed">{item.description}</p>
              </m.div>
            ))}
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-serif italic text-4xl mb-6">{heading}</h2>
            {body && <p className="text-primary/65 mb-10 leading-relaxed max-w-md">{body}</p>}
            {href && (
              <Link
                href={href}
                className="px-8 py-4 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/88 transition-colors inline-block"
              >
                {link?.label}
              </Link>
            )}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
