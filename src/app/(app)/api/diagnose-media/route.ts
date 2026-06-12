import config from "@payload-config";
import { list } from "@vercel/blob";
import { headers } from "next/headers";
import { createLocalReq, getPayload } from "payload";

import { checkRole } from "@/access/utilities";

export async function GET(): Promise<Response> {
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

  const local: { id: unknown; filename: unknown; url: unknown; createdAt: unknown }[] = [];
  const blob: { id: unknown; filename: unknown; url: unknown; createdAt: unknown }[] = [];

  for (const item of mediaItems) {
    const entry = {
      id: item.id,
      filename: item.filename,
      url: item.url,
      createdAt: item.createdAt,
    };

    if (entry.url && String(entry.url).startsWith("/")) {
      local.push(entry);
    } else if (entry.url && String(entry.url).startsWith("http")) {
      blob.push(entry);
    } else {
      local.push(entry);
    }
  }

  let blobs: { url: string; pathname: string }[] = [];

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      let cursor: string | undefined;
      do {
        const result = await list({ cursor, limit: 1000 });
        blobs.push(...result.blobs.map((b) => ({ url: b.url, pathname: b.pathname })));
        cursor = result.cursor;
      } while (cursor);
    } catch {
      blobs = [];
    }
  }

  const matched = local.filter((l) =>
    blobs.some(
      (b) =>
        b.pathname.endsWith(String(l.filename)) ||
        b.url.endsWith(encodeURIComponent(String(l.filename))),
    ),
  );

  return Response.json({
    totalMediaItems: mediaItems.length,
    localUrlCount: local.length,
    blobUrlCount: blob.length,
    blobStoreFileCount: blobs.length,
    matchedOnBlob: matched.map((m) => ({ id: m.id, filename: m.filename })),
    localUrls: local,
    blobUrls: blob,
    blobStorePaths: blobs.map((b) => b.pathname),
  });
}
