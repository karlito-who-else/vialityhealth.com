import { get } from "@vercel/blob";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  if (!filename) {
    return new Response("Missing filename", { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new Response("Blob storage not configured", { status: 500 });
  }

  try {
    const result = await get(filename, { access: "public" });

    if (!result) {
      return new Response("Not found", { status: 404 });
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
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
