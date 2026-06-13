import { head, getDownloadUrl } from "@vercel/blob";
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

  try {
    const blob = await head(filename);
    if (!blob?.url) {
      return new Response("Not found", { status: 404 });
    }

    const downloadUrl = getDownloadUrl(blob.url);
    return Response.redirect(downloadUrl, 302);
  } catch {
    return new Response("Proxy failed", { status: 502 });
  }
}
