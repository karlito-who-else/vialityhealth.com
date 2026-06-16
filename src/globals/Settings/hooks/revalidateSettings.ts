import { revalidateTag } from "next/cache.js";
import type { GlobalAfterChangeHook } from "payload";

export const revalidateSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (context.disableRevalidate) return doc;

  payload.logger.info("Revalidating settings global");

  try {
    (revalidateTag as (tag: string) => undefined)("global_settings");
  } catch {
    payload.logger.warn("revalidateTag unavailable — skipping.");
  }

  return doc;
};
