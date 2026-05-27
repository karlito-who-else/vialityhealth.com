"use client";

import { Link } from "@/components/atoms/Link";
import { resolveLinkHref } from "@/utilities/resolveLinkHref";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";

import { GrainOverlay } from "./GrainOverlay";
import { VideoPanel } from "./VideoPanel";

export type HeroSectionProps = {
  tagline: string;
  title: string;
  subtext?: string | null;
  links?:
  | {
    link: {
      type?: ("reference" | "custom") | null;
      newTab?: boolean | null;
      reference?: {
        relationTo: "pages";
        value: unknown;
      } | null;
      url?: string | null;
      label: string;
    };
  }[]
  | null;
  media?: {
    mediaItem?: (number | null) | { url?: string | null; mimeType?: string | null };
    id?: string | null;
  }[] | null;
  scrollLabel: string;
};

export function HeroSection({
  tagline,
  title,
  subtext,
  links,
  media,
  scrollLabel,
}: HeroSectionProps) {
  const items = links || [];
  const primary = items[0];
  const secondary = items[1];

  return (
    <LazyMotion features={domAnimation}>
      <section className="relative h-screen w-full overflow-hidden" data-component="HeroSection">
        <div className="absolute inset-0 flex">
          <div className="hidden md:flex w-full h-full">
            {media?.map((item) => {
              const m = item?.mediaItem;
              if (!m || typeof m === "number") return null;
              return (
                <VideoPanel key={item.id} src={m.url ?? ""} type={m.mimeType} />
              );
            })}
          </div>
          <div className="md:hidden absolute inset-0 bg-ink-well">
            {(() => {
              const first = media?.[0]?.mediaItem;
              if (!first || typeof first === "number") return null;
              const isVideo = first.mimeType?.startsWith("video/");
              return (
                <>
                  {isVideo ? (
                    <video
                      src={first.url ?? ""}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={first.url ?? ""}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, var(--color-video-overlay) 100%)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-video-overlay-strong) 0%, transparent 100%)",
                    }}
                  />
                </>
              );
            })()}
          </div>
        </div>

        <GrainOverlay />

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6">
          <m.p
            className="text-lg font-sans font-light text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            {tagline}
          </m.p>

          <m.h1
            className="logo text-7xl text-white"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {title}
          </m.h1>

          {subtext && (
            <m.p
              className="text-lg font-sans font-light text-white mt-6 md:mt-10 max-w-xs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 1, ease: "easeOut" }}
            >
              {subtext}
            </m.p>
          )}

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: "easeOut" }}
            className="mt-10 grid sm:grid-cols-2 gap-4"
          >
            {primary?.link && (
              <Link
                href={resolveLinkHref(primary.link)}
                className="px-9 py-3.5 bg-primary-foreground text-ink text-xs uppercase tracking-widest hover:bg-primary-foreground/90 active:bg-primary-foreground/80 transition-colors duration-200"
              >
                {primary.link.label}
              </Link>
            )}
            {secondary?.link && (
              <Link
                href={resolveLinkHref(secondary.link)}
                className="px-9 py-3.5 border border-primary-foreground/50 text-primary-foreground text-xs uppercase tracking-widest hover:border-primary-foreground hover:bg-primary-foreground/8 transition-all duration-200"
              >
                {secondary.link.label}
              </Link>
            )}
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <m.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-primary-foreground/30"
          />
          <span className="text-primary-foreground/30 text-xs uppercase tracking-widest">
            {scrollLabel}
          </span>
        </m.div>
      </section>
    </LazyMotion>
  );
}
