import type { Payload, PayloadRequest } from "payload";
import type { Media } from "@/payload-types";

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
      ? emailLogo
      : siteLogo && typeof siteLogo === "object" && "url" in siteLogo && siteLogo.url
        ? siteLogo
        : null;

  const logoHTML =
    logo && typeof logo === "object" && "url" in logo && logo.url
      ? logoMarkup(logo.url, logo.alt || siteName)
      : textLogoMarkup(siteName);

  return { logoHTML };
};
