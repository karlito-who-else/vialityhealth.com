import { head, get } from "@vercel/blob";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!filename || !token) {
    return new Response(
      JSON.stringify({ error: "Missing filename or BLOB_READ_WRITE_TOKEN" }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  try {
    const meta = await head(filename, { token });
    console.error("head result:", JSON.stringify(meta));

    if (!meta?.url) {
      return new Response(
        JSON.stringify({ error: "Blob not found by head()" }),
        { status: 404, headers: { "content-type": "application/json" } },
      );
    }

    const getResult = await get(meta.pathname, { access: "private", token });

    if (!getResult || getResult.statusCode !== 200 || !getResult.stream) {
      return new Response(
        JSON.stringify({
          error: `get() returned status ${getResult?.statusCode}`,
          downloadUrl: meta.downloadUrl,
          url: meta.url,
          pathname: meta.pathname,
        }),
        { status: 502, headers: { "content-type": "application/json" } },
      );
    }

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
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}
