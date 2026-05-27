"use client";
import { Link } from "@/components/atoms/Link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { Header } from "src/payload-types";

import { Cart } from "@/components/Cart";
import { cn } from "@/utilities/cn";
import { resolveLinkHref } from "@/utilities/resolveLinkHref";

import { MobileMenu } from "./MobileMenu";

type Props = {
  className?: string;
  header: Header;
};

export function HeaderClient({ className, header }: Props) {
  const { siteTitle, navItems } = header;
  const menu = navItems || [];
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const onHero = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
            "logo text-3xl transition-opacity hover:opacity-60 shrink-0",
            transparent ? "text-foreground" : "text-foreground  ",
          )}
        >
          {siteTitle || "viality"}
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

        {/* Right — cart */}
        <div className="flex items-center gap-4 shrink-0">
          <div className={cn(transparent ? "text-foreground" : "text-foreground")}>
            <Suspense fallback={null}>
              <Cart />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
