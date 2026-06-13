import { head, list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  try {
    const result = await list({ limit: 1, token });
    const blob = result.blobs?.[0];

    if (!blob) {
      return Response.json({ error: "no blobs found" });
    }

    const meta = await head(blob.pathname, { token });

    return Response.json({
      pathname: blob.pathname,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      headDownloadUrl: meta.downloadUrl,
      headUrl: meta.url,
    });
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
