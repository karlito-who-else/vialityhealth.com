import { env } from "@/utilities/env";
import { canUseDOM } from "./canUseDOM";

export const getServerSideURL = () => {
  const url = env('NEXT_PUBLIC_SERVER_URL', '');

  if (url) return url;

  const vercelUrl = env('VERCEL_PROJECT_PRODUCTION_URL', '');
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
};

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol;
    const domain = window.location.hostname;
    const port = window.location.port;

    return `${protocol}//${domain}${port ? `:${port}` : ""}`;
  }

  const vercelUrl = env('VERCEL_PROJECT_PRODUCTION_URL', '');
  if (vercelUrl) return `https://${vercelUrl}`;

  return env('NEXT_PUBLIC_SERVER_URL', '');
};
