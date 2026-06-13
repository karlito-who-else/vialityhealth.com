export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN
      ? `set (length ${process.env.BLOB_READ_WRITE_TOKEN.length})`
      : "NOT SET",
    BLOB_STORE_ID: process.env.BLOB_STORE_ID ?? "NOT SET",
    NODE_ENV: process.env.NODE_ENV ?? "NOT SET",
    allKeys: Object.keys(process.env).filter((k) => k.includes("BLOB") || k.includes("VERCEL")),
  });
}
