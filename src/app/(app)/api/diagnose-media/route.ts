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

  const localUrls: { id: number; filename: string; url: string; createdAt: string }[] = [];
  const blobUrls: { id: number; filename: string; url: string; createdAt: string }[] = [];

  for (const item of mediaItems) {
    const entry = {
      id: item.id,
      filename: item.filename,
      url: item.url,
      createdAt: item.createdAt,
    };

    if (item.url && (item.url as string).startsWith("/")) {
      localUrls.push(entry);
    } else if (item.url && (item.url as string).startsWith("http")) {
      blobUrls.push(entry);
    } else {
      localUrls.push(entry);
    }
  }

  let blobStoreFiles: { url: string; pathname: string }[] = [];

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    try {
      let cursor: string | undefined;
      do {
        const result = await list({ cursor, limit: 1000 });
        blobStoreFiles.push(
          ...result.blobs.map((b) => ({ url: b.url, pathname: b.pathname })),
        );
        cursor = result.cursor;
      } while (cursor);
    } catch (e) {
      blobStoreFiles = [];
    }
  }

  const matchedOnBlob = localUrls.filter((local) =>
    blobStoreFiles.some(
      (blob) =>
        blob.pathname.endsWith(local.filename) ||
        blob.url.endsWith(encodeURIComponent(local.filename)),
    ),
  );

  return Response.json({
    totalMediaItems: mediaItems.length,
    localUrlCount: localUrls.length,
    blobUrlCount: blobUrls.length,
    blobStoreFileCount: blobStoreFiles.length,
    matchedOnBlob: matchedOnBlob.map((m) => ({ id: m.id, filename: m.filename })),
    localUrls,
    blobUrls,
    blobStorePaths: blobStoreFiles.map((b) => b.pathname),
  });
}
