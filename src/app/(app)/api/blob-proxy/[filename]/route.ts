import { list, get } from "@vercel/blob";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename || !process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Missing filename or BLOB_READ_WRITE_TOKEN" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  try {
    const result = await list({ prefix: filename, limit: 1 });
    const blob = result.blobs?.[0];

    if (!blob?.url) {
      return new Response(
        JSON.stringify({ error: "Blob not found", filename }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    }

    console.error("blob found:", blob.url);

    const { stream, blob: blobMeta } = await get(blob.url, {
      access: "private",
    });

    console.error("get succeeded, contentType:", blobMeta?.contentType);

    return new Response(stream as ReadableStream, {
      headers: {
        "Content-Type": blobMeta?.contentType ?? "application/octet-stream",
        "Content-Disposition": blobMeta?.contentDisposition ?? `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("blob proxy error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
