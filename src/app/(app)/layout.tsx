import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { AdminBar } from "@/components/AdminBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { SiteBanner } from "@/components/SiteBanner";
import { AgeVerificationDialog } from "@/components/viality/AgeVerificationDialog";
import { WaitlistPopover } from "@/components/viality/WaitlistPopover";
import { Providers } from "@/providers";
import { env } from "@/utilities/env";
import { getCachedGlobal } from "@/utilities/getGlobals";

// Repalce with `next/font/google` when the font is added to that package
import localFont from 'next/font/local';

const iosevkaCharon = localFont({
  src: [
    {
      path: '../../../public/fonts/IosevkaCharon-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/IosevkaCharon-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/IosevkaCharon-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/IosevkaCharon-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/IosevkaCharon-Italic.ttf', // If you use italics
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-serif',
})

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const vercelUrl = env.NEXT_PUBLIC_VERCEL_URL ?? '';
const baseUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal("settings", 1)();

  const defaultTitle = settings?.defaultTitle || "viality — Wellness, refined.";
  const defaultDescription =
    settings?.defaultDescription ||
    "viality — modern rituals for internal balance. Premium clinical wellness, formulated with precision and held to a quieter standard.";

  return {
    metadataBase: new URL(baseUrl),
    robots: {
      follow: true,
      index: true,
    },
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[inter.variable, iosevkaCharon.variable].filter(Boolean).join(" ")}
      lang="en"
    >
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="group/body min-h-screen flex flex-col">
        <Providers>
          <AdminBar />
          <LivePreviewListener />
          <SiteBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AgeVerificationDialog />
          <WaitlistPopover />
        </Providers>
      </body>
    </html>
  );
}
