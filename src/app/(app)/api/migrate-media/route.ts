import config from "@payload-config";
import { list } from "@vercel/blob";
import { headers } from "next/headers";
import { getPayload } from "payload";

import { checkRole } from "@/access/utilities";

export async function POST(): Promise<Response> {
  const [payload, requestHeaders] = await Promise.all([getPayload({ config }), headers()]);

  const { user } = await payload.auth({ headers: requestHeaders });

  if (!user || !checkRole(["admin"], user)) {
    return new Response("Action forbidden.", { status: 403 });
  }

  const { docs: mediaItems } = await payload.find({
    collection: "media",
    limit: 1000,
    sort: "createdAt",
  });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "BLOB_READ_WRITE_TOKEN not set" }, { status: 500 });
  }

  let blobs: { url: string; pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    blobs.push(...result.blobs.map((b) => ({ url: b.url, pathname: b.pathname })));
    cursor = result.cursor;
  } while (cursor);

  const updated: { id: unknown; filename: unknown; oldUrl: unknown; newUrl: string }[] = [];
  const skipped: { id: unknown; filename: unknown; reason: string }[] = [];

  for (const item of mediaItems) {
    if (item.url && String(item.url).startsWith("http")) {
      skipped.push({ id: item.id, filename: item.filename, reason: "already has blob URL" });
      continue;
    }

    const match = blobs.find((b) => b.pathname === String(item.filename));

    if (!match) {
      skipped.push({ id: item.id, filename: item.filename, reason: "not found on blob storage" });
      continue;
    }

    const oldUrl = String(item.url);

    await payload.update({
      collection: "media",
      id: item.id,
      data: { url: match.url },
    });

    updated.push({ id: item.id, filename: item.filename, oldUrl, newUrl: match.url });
  }

  return Response.json({
    message: "Migration complete",
    totalMediaItems: mediaItems.length,
    totalBlobs: blobs.length,
    updatedCount: updated.length,
    skippedCount: skipped.length,
    updated,
    skipped,
  });
}
