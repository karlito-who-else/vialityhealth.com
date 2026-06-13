import { get, head } from "@vercel/blob";
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

  // Try get() with both access modes
  for (const access of ["public", "private"] as const) {
    try {
      const blob = await head(filename);
      console.error(`head(${filename}): ${blob?.url} dl=${blob?.downloadUrl}`);
    } catch {
      // ignore
    }

    try {
      const result = await get(filename, { access });

      if (!result) {
        console.error(`get ${access}: null`);
        continue;
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
      console.error(`get ${access} failed:`, String(e));
    }
  }

  return new Response("Blob proxy failed", { status: 502 });
}
