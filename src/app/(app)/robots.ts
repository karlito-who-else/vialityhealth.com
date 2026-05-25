import { env } from "@/utilities/env";

/* eslint-disable no-restricted-exports */
const vercelUrl = env.NEXT_PUBLIC_VERCEL_URL ?? '';
const baseUrl = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";

export default function robots() {
  return {
    host: baseUrl,
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
