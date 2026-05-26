"use client";

import { LazyMotion, domAnimation, m, AnimatePresence, type Variants, type Easing } from "framer-motion";
import { X } from "lucide-react";
import { Link } from "@/components/atoms/Link";
import { resolveLinkHref } from "@/utilities/resolveLinkHref";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as Easing },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as Easing, delay: 0.15 },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 40, skewY: 1.5 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1] as Easing,
      delay: 0.18 + i * 0.075,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn" as Easing,
      delay: i * 0.03,
    },
  }),
};

export function MobileMenu({ menu, siteTitle }: { menu: any[]; siteTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setIsOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        className="md:hidden flex flex-col gap-[5px] p-1 transition-opacity hover:opacity-60 text-primary"
      >
        <span className="block w-5 h-[1.5px] bg-primary" />
        <span className="block w-5 h-[1.5px] bg-primary" />
      </button>

      {mounted && createPortal(
        <LazyMotion features={domAnimation}>
          <AnimatePresence>
            {isOpen && (
            <m.div
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed inset-0 z-50 flex flex-col overflow-hidden"
              style={{ background: "var(--color-ink-well)" }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  opacity: 0.055,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  backgroundSize: "180px 180px",
                  mixBlendMode: "screen",
                }}
              />

              <div className="relative z-10 flex items-center justify-between px-6 md:px-12 h-[72px] shrink-0">
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="font-serif italic font-light text-primary-foreground/30 hover:text-primary-foreground/55 transition-colors duration-300"
                    style={{ fontSize: "1.05rem", letterSpacing: "0.05em" }}
                  >
                    {siteTitle}
                  </Link>
                </m.div>

                <m.button
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="size-10 flex items-center justify-center text-primary-foreground/40 hover:text-primary-foreground/80 transition-colors duration-200 -mr-2"
                >
                  <X size={20} strokeWidth={1.2} />
                </m.button>
              </div>

              <nav className="relative z-10 flex-1 flex flex-col justify-center px-8 md:px-16 xl:px-24 overflow-hidden">
                <m.div
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0, originY: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                  className="absolute left-8 md:left-16 xl:left-24 top-8 bottom-8 w-px bg-primary-foreground/8 origin-top"
                />

                <ul className="flex flex-col pl-5 md:pl-8">
                  {menu.map((item, i) => {
                    const href = resolveLinkHref(item.link);
                    return (
                      <m.li
                        key={item.id}
                        custom={i}
                        variants={linkVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="overflow-hidden py-0.5"
                      >
                        <Link
                          href={href}
                          onClick={() => setIsOpen(false)}
                          className="group flex items-baseline gap-4 md:gap-6 w-fit"
                        >
                          <span className="text-xs text-primary-foreground/18 uppercase tracking-widest tabular-nums translate-y-[-0.15em] transition-colors duration-300 group-hover:text-primary-foreground/35 hidden sm:block">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="font-serif italic text-primary-foreground/85 leading-[1.1] transition-all duration-400 group-hover:text-primary-foreground group-hover:translate-x-1.5 inline-block"
                            style={{ fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)" }}
                          >
                            {item.link.label}
                          </span>
                          <span className="text-primary-foreground/0 group-hover:text-primary-foreground/30 transition-all duration-300 translate-x-0 group-hover:translate-x-1 text-sm self-center font-light">
                            →
                          </span>
                        </Link>
                      </m.li>
                    );
                  })}
                </ul>
              </nav>
            </m.div>
            )}
          </AnimatePresence>
        </LazyMotion>,
        document.body
      )}
    </>
  );
}
