"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export type PhilosophySectionProps = {
  body?: string | null;
  linkLabel?: string | null;
  link?: string | null;
};

export function PhilosophySection({ body, linkLabel, link }: PhilosophySectionProps) {
  return (
    <section className="py-36 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        {body && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="font-serif text-2xl md:text-4xl leading-relaxed text-primary/90"
          >
            {body}
          </motion.p>
        )}
        {linkLabel && link && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12"
          >
            <Link
              href={link}
              className="inline-block border-b border-primary/30 pb-1 text-xs uppercase tracking-widest hover:border-primary transition-colors"
            >
              {linkLabel}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
