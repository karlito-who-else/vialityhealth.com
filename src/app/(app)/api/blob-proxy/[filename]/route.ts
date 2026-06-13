import { head, getDownloadUrl } from "@vercel/blob";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename || !process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing filename or BLOB_READ_WRITE_TOKEN" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const blob = await head(filename);
    console.error("blob head result:", JSON.stringify(blob));
    if (!blob?.url) {
      return new Response(JSON.stringify({ error: "Blob not found by head()", filename }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }

    const downloadUrl = getDownloadUrl(blob.url);
    console.error("downloadUrl:", downloadUrl);
    return Response.redirect(downloadUrl, 302);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("blob proxy error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
}
