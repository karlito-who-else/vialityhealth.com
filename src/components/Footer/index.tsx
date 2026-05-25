import { Link } from "@/components/atoms/Link";
import React from "react";

import { getCachedGlobal } from "@/utilities/getGlobals";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const footer = await getCachedGlobal("footer", 2)();

  const brandName = footer?.brandName || "viality";
  const brandDescription = footer?.brandDescription;
  const navItems = footer?.navItems || [];
  const socialLinks = footer?.socialLinks || [];
  const legalLinks = footer?.legalLinks || [];
  const copyrightTemplate = footer?.copyright || "© {year} viality. All rights reserved.";
  const complianceText = footer?.complianceText;

  const copyright = copyrightTemplate.replace(/\{year\}/g, String(currentYear));

  const linkHref = (item: (typeof navItems)[number]) => {
    const link = item.link;
    if (link.type === "reference" && link.reference?.value) {
      return typeof link.reference.value === "object"
        ? link.reference.value.slug
          ? `/${link.reference.value.slug}`
          : link.url || "/"
        : `/${link.reference.value}`;
    }
    return link.url || "/";
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link
            href="/"
            className="font-serif italic font-light tracking-widest block mb-6 hover:opacity-70 transition-opacity"
            style={{ fontSize: "1.45rem" }}
          >
            {brandName}
          </Link>
          {brandDescription && (
            <p className="text-primary-foreground/70 max-w-sm font-light leading-relaxed">
              {brandDescription}
            </p>
          )}
        </div>

        <div>
          <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">Explore</h4>
          {navItems.length > 0 && (
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link href={linkHref(item)} className="hover:text-accent transition-colors">
                    {item.link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="uppercase tracking-widest text-xs font-semibold mb-6">Connect</h4>
          {socialLinks.length > 0 && (
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              {socialLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    className="hover:text-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
        <p>{copyright}</p>
        {legalLinks.length > 0 && (
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                className="hover:text-primary-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {complianceText && (
        <div className="max-w-7xl mx-auto mt-12 text-xs text-primary-foreground/30 text-center uppercase tracking-widest leading-relaxed">
          {complianceText.split("\n").map((line, i) => (
            <p key={`compliance-line-${i}`}>{line}</p>
          ))}
        </div>
      )}
    </footer>
  );
}
