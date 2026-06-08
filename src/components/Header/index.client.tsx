"use client";
import { Link } from "@/components/atoms/Link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, Suspense, useEffect, useState } from "react";
import type { Header, Setting } from "src/payload-types";

import { cn } from "@/utilities/cn";
import { resolveLinkHref } from "@/utilities/resolveLinkHref";

import { MobileMenu } from "./MobileMenu";

const Cart = dynamic(() => import("@/components/Cart"), { ssr: false });

type Props = {
  className?: string;
  header: Header;
  settings: Setting;
};

export function HeaderClient({ className, header, settings }: Props) {
  const { siteTitle, navItems } = header;
  const { logo } = settings;
  const menu = navItems || [];
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const onHero = pathname === "/";
  const scrollRaf = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRaf.current !== null) return;
      scrollRaf.current = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 60);
        scrollRaf.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRaf.current !== null) cancelAnimationFrame(scrollRaf.current);
    };
  }, []);

  const transparent = onHero && !isScrolled;

  return (
    <nav
      className={cn(
        "sticky top-0 left-0 right-0 z-40 transition-all duration-500",
        transparent ? "bg-transparent" : "bg-background/95 backdrop-blur-md",
        className,
      )}
    >
      <div className="h-18 container mx-auto px-8 sm:px-0 flex items-center justify-between gap-6">
        {/* Mobile menu trigger */}
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} siteTitle={siteTitle || "viality"} />
          </Suspense>
        </div>

        {/* Logo — left */}
        <Link
          href="/"
          className={cn(
            "logo shrink-0 transition-opacity hover:opacity-60 size-full max-w-2/6 md:max-w-1/6 relative",
            transparent ? "text-foreground" : "text-foreground",
            // logo ? "h-12" : "text-3xl",
          )}
        >
          {logo && typeof logo !== "number" ? (
            <Image
              fill
              src={logo.url || ""}
              alt={logo.alt || siteTitle || "viality"}
              className="size-full dark:invert"
              priority
            />
          ) : (
            siteTitle || "viality"
          )}
        </Link>

        {/* Center nav links — desktop only */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {menu.map((item) => {
            const href = resolveLinkHref(item.link);
            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "text-xs uppercase tracking-widest transition-opacity hover:opacity-60",
                  transparent ? "text-foreground" : "text-foreground",
                )}
              >
                {item.link.label}
              </Link>
            );
          })}
        </div>

        {/* Right — account + cart */}
        <div className="flex items-center gap-4 shrink-0 [&_svg]:size-6">
          <Link
            href="/account"
            className={cn(
              "transition-opacity hover:opacity-60",
            )}
            aria-label="Account"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <Suspense fallback={null}>
            <Cart />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
