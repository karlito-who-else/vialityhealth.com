import { list, get } from "@vercel/blob";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  const tokenStatus = process.env.BLOB_READ_WRITE_TOKEN
    ? `set (len=${process.env.BLOB_READ_WRITE_TOKEN.length})`
    : "NOT SET";

  if (!filename) {
    return new Response(JSON.stringify({ error: "Missing filename", tokenStatus }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    console.error("Starting list(), token:", tokenStatus);
    const result = await list({ prefix: filename, limit: 1 });
    const blob = result.blobs?.[0];

    if (!blob?.url) {
      return new Response(
        JSON.stringify({ error: "Blob not found", filename, tokenStatus }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    }

    console.error("blob found:", blob.url);

    const getResult = await get(blob.url, {
      access: "private",
    });

    if (!getResult || getResult.statusCode !== 200 || !getResult.stream) {
      return new Response(
        JSON.stringify({ error: "get() returned non-200", statusCode: getResult?.statusCode }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

    console.error("get succeeded, contentType:", getResult.blob?.contentType);

    return new Response(getResult.stream as ReadableStream, {
      headers: {
        "Content-Type": getResult.blob?.contentType ?? "application/octet-stream",
        "Content-Disposition":
          getResult.blob?.contentDisposition ?? `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("blob proxy error:", msg);
    return new Response(
      JSON.stringify({ error: msg, tokenStatus }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}
