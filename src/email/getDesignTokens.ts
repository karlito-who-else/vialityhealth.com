import type { Payload, PayloadRequest } from "payload";
import type { Media } from "@/payload-types";

import { getServerSideURL } from "@/utilities/getURL";
import { logoMarkup, textLogoMarkup, type DesignTokens } from "./templates";

type GetDesignTokensArgs = {
  payload: Payload;
  req?: PayloadRequest;
};

type SettingsWithEmailLogo = {
  siteName?: string | null;
  logo?: (number | null) | Media;
  emailLogo?: (number | null) | Media;
};

const toAbsoluteURL = (url: string): string => {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const base = getServerSideURL().replace(/\/+$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
};

export const getDesignTokens = async ({
  payload,
  req,
}: GetDesignTokensArgs): Promise<DesignTokens> => {
  const settings = (await payload.findGlobal({
    slug: "settings",
    depth: 1,
    req,
  })) as SettingsWithEmailLogo;

  const siteName = settings?.siteName || "Viality";
  const emailLogo = settings?.emailLogo;
  const siteLogo = settings?.logo;

  const logo =
    emailLogo && typeof emailLogo === "object" && "url" in emailLogo && emailLogo.url
      ? (emailLogo as Media)
      : siteLogo && typeof siteLogo === "object" && "url" in siteLogo && siteLogo.url
        ? (siteLogo as Media)
        : null;

  const logoAlt = logo?.alt || siteName;
  const logoURL = logo?.url ? toAbsoluteURL(logo.url) : null;

  const logoHTML = logoURL ? logoMarkup(logoURL, logoAlt) : textLogoMarkup(siteName);

  return { logoHTML };
};
