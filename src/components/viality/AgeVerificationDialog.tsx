"use client";

import { useEffect, useRef } from "react";

const COOKIE_NAME = "viality_age_verified";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getExternalReferrer(): string | null {
  if (typeof document === "undefined") return null;
  const referrer = document.referrer;
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.origin === window.location.origin) return null;
    return referrer;
  } catch {
    return null;
  }
}

function sendAway() {
  const external = getExternalReferrer();
  if (external) {
    window.location.replace(external);
  } else {
    window.location.replace("https://www.google.com");
  }
}

export function AgeVerificationDialog() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const confirmedRef = useRef(false);

  useEffect(() => {
    const popover = popoverRef.current;
    if (!popover) return;

    if (getCookie(COOKIE_NAME)) return;

    const showTimeout = setTimeout(() => {
      popover.showPopover();
    }, 2000);

    function onToggle(e: Event) {
      const event = e as ToggleEvent;
      if (event.newState === "closed" && confirmedRef.current) {
        setCookie(COOKIE_NAME, "true", 365);
      }
    }

    popover.addEventListener("toggle", onToggle);
    return () => {
      clearTimeout(showTimeout);
      popover.removeEventListener("toggle", onToggle);
    };
  }, []);

  function handleConfirm() {
    confirmedRef.current = true;
    setCookie(COOKIE_NAME, "true", 365);
    popoverRef.current?.hidePopover();
  }

  function handleDeny() {
    sendAway();
  }

  return (
    <div
      ref={popoverRef}
      popover="auto"
      data-component="AgeVerificationDialog"
      className="[&::backdrop]:bg-black/50 fixed inset-0 z-50 mx-auto my-auto max-w-md w-[calc(100%-2rem)] bg-white rounded-lg shadow-xl border overflow-hidden"
    >
      <div className="flex flex-col items-center text-center px-8 py-12">
        <h2 className="font-sans uppercase text-2xl mb-3 text-primary">Are you 18 or older?</h2>
        <p className="text-sm text-primary/70 mb-8 max-w-sm leading-relaxed">
          You must be of legal age to enter this site. Please confirm your age to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            Yes, I&apos;m 18+
          </button>
          <button
            type="button"
            onClick={handleDeny}
            className="flex-1 px-6 py-3 bg-transparent border border-primary/25 text-primary text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors"
          >
            No, I&apos;m under 18
          </button>
        </div>
      </div>
    </div>
  );
}
