"use client";

import { subscribeToWaitlist } from "@/actions/waitlist";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { useAction } from "next-safe-action/hooks";

export type WaitlistSectionProps = {
  heading: string;
  body?: string | null;
  placeholder: string;
  buttonLabel: string;
};

export function WaitlistSection({ heading, body, placeholder, buttonLabel }: WaitlistSectionProps) {
  const { execute, result, isPending } = useAction(subscribeToWaitlist);
  const success = result.data?.success;

  return (
    <LazyMotion features={domAnimation}>
      <section className="scheme-only-light py-6 md:py-32 px-6 bg-primary text-primary-foreground text-center" data-component="WaitlistSection">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <m.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl mb-4"
          >
            {heading}
          </m.h2>
          {body && (
            <p className="text-primary-foreground/65 mb-10 text-sm max-w-md leading-relaxed">
              {body}
            </p>
          )}
          <form
            className="w-full flex flex-col sm:flex-row gap-4 max-w-md"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              execute({ email: formData.get("email") as string });
            }}
          >
            <input
              type="email"
              name="email"
              placeholder={placeholder}
              className="flex-1 bg-transparent border-b border-primary-foreground/25 px-4 py-3 text-xs focus:outline-none focus:border-accent placeholder:text-primary-foreground/30 uppercase tracking-widest transition-colors disabled:opacity-50"
              required
              disabled={isPending || !!success}
            />
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-widest hover:bg-accent/88 transition-colors disabled:opacity-50"
              disabled={isPending || !!success}
            >
              {isPending ? "Sending..." : success ? "Subscribed!" : buttonLabel}
            </button>
          </form>
          {result.validationErrors?.email?._errors && (
            <p className="mt-4 text-xs text-red-300">
              {result.validationErrors.email._errors[0]}
            </p>
          )}
          {result.serverError && (
            <p className="mt-4 text-xs text-red-300">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </section>
    </LazyMotion>
  );
}
