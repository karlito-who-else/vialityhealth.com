"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

export type WaitlistSectionProps = {
  heading: string;
  body?: string | null;
  placeholder: string;
  buttonLabel: string;
};

export function WaitlistSection({ heading, body, placeholder, buttonLabel }: WaitlistSectionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <section className="scheme-only-light py-32 px-6 bg-primary text-primary-foreground text-center" data-component="WaitlistSection">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <m.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif italic text-4xl mb-4"
          >
            {heading}
          </m.h2>
          {body && (
            <p className="text-primary-foreground/65 mb-10 text-sm max-w-md leading-relaxed">
              {body}
            </p>
          )}
          <form className="w-full flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="email"
              placeholder={placeholder}
              className="flex-1 bg-transparent border-b border-primary-foreground/25 px-4 py-3 text-xs focus:outline-none focus:border-accent placeholder:text-primary-foreground/30 uppercase tracking-widest transition-colors"
              required
            />
            <button
              type="button"
              className="px-8 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/88 transition-colors"
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </section>
    </LazyMotion>
  );
}
