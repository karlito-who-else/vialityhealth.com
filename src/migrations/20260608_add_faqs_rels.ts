import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages_rels" ADD COLUMN IF NOT EXISTS "faqs_id" integer`);
  await db.execute(sql`ALTER TABLE "products_rels" ADD COLUMN IF NOT EXISTS "faqs_id" integer`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages_rels" DROP COLUMN IF EXISTS "faqs_id"`);
  await db.execute(sql`ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "faqs_id"`);
}
