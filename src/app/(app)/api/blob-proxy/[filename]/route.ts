import { list } from "@vercel/blob";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename || !process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(null, { status: 400 });
  }

  // Find the blob URL via the SDK API (authentication works here)
  let blobUrl: string | undefined;
  let cursor: string | undefined;
  do {
    const result = await list({ cursor, limit: 1000 });
    const found = result.blobs.find((b) => b.pathname === filename);
    if (found) {
      blobUrl = found.url;
      break;
    }
    cursor = result.cursor;
  } while (cursor);

  if (!blobUrl) {
    console.error("blob not found:", filename);
    return new Response("Not found", { status: 404 });
  }

  // Try native fetch with the token to bypass public access restriction
  try {
    const response = await fetch(blobUrl, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok || !response.body) {
      console.error(`fetch status: ${response.status}`);
      return new Response(`Blob fetch failed: ${response.status}`, { status: 502 });
    }

    const headers: Record<string, string> = {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (e) {
    console.error("fetch error:", String(e));
    return new Response(String(e), { status: 502 });
  }
}
