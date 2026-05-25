import { revalidatePath } from "next/cache.js";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

import type { Page } from "../../../payload-types";

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc;

  if (doc._status === "published") {
    const path = doc.slug === "home" ? "/" : `/${doc.slug}`;

    payload.logger.info(`Revalidating page at path: ${path}`);

    try {
      revalidatePath(path);
    } catch {
      payload.logger.warn("revalidatePath unavailable — skipping.");
    }
  }

  if (previousDoc?._status === "published" && doc._status !== "published") {
    const oldPath = previousDoc.slug === "home" ? "/" : `/${previousDoc.slug}`;

    payload.logger.info(`Revalidating old page at path: ${oldPath}`);

    try {
      revalidatePath(oldPath);
    } catch {
      payload.logger.warn("revalidatePath unavailable — skipping.");
    }
  }

  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (context.disableRevalidate) return doc;

  const path = doc?.slug === "home" ? "/" : `/${doc?.slug}`;
  try {
    revalidatePath(path);
  } catch {
    // revalidatePath unavailable outside Next.js runtime — ignore
  }

  return doc;
};
