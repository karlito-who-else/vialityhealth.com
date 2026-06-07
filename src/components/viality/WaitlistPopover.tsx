"use client";

import { XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { WaitlistSection } from "./WaitlistSection";

const COOKIE_NAME = "viality_waitlist_dismissed";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function WaitlistPopover() {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    if (getCookie(COOKIE_NAME)) return;

    const showTimeout = setTimeout(() => {
      popover.showPopover();
    }, 2000);

    function onToggle(e: Event) {
      const event = e as ToggleEvent;
      if (event.newState === "closed") {
        setCookie(COOKIE_NAME, "true", 365);
      }
    }

    popover.addEventListener("toggle", onToggle);
    return () => {
      clearTimeout(showTimeout);
      popover.removeEventListener("toggle", onToggle);
    };
  }, []);

  return (
    <div
      ref={popoverRef}
      popover="auto"
      className="[&::backdrop]:bg-black/50 fixed inset-0 z-50 mx-auto my-auto max-w-lg w-[calc(100%-2rem)] bg-white rounded-lg shadow-xl border overflow-hidden"
    >
      <button
        onClick={() => popoverRef.current?.hidePopover()}
        className="absolute top-4 right-4 z-10 size-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        aria-label="Close"
      >
        <XIcon className="size-4" />
      </button>
      <WaitlistSection
        heading="Your VIP Pass"
        subheading="Subscribe for product updates and discount offers"
        body={null}
        placeholder="YOUR EMAIL ADDRESS"
        buttonLabel="Sign up"
        legalText=""
      />
    </div>
  );
}
