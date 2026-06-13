import { head, get } from "@vercel/blob";
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

  // Try redirecting to the download URL first (fastest path)
  try {
    const meta = await head(filename, { token: process.env.BLOB_READ_WRITE_TOKEN });
    if (meta?.downloadUrl) {
      console.error("downloadUrl:", meta.downloadUrl);
      return Response.redirect(meta.downloadUrl, 302);
    }
  } catch (e) {
    console.error("head() failed:", String(e));
  }

  // Fallback: proxy through function using SDK
  try {
    const result = await get(filename, { access: "private" });

    if (!result) {
      return new Response(null, { status: 404 });
    }

    const headers: Record<string, string> = {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (result.blob.size) {
      headers["Content-Length"] = String(result.blob.size);
    }

    return new Response(result.stream as ReadableStream, {
      status: result.statusCode,
      headers,
    });
  } catch (e) {
    console.error("get() failed:", String(e));
    return new Response(String(e), { status: 500 });
  }
}
