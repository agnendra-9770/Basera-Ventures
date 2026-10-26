import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "_objectkey" varchar;`)
  // Uploaded files themselves (see src/lib/database-storage.ts).
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "media_files" (
  	"key" varchar PRIMARY KEY NOT NULL,
  	"mime_type" varchar NOT NULL,
  	"size" integer NOT NULL,
  	"data" bytea NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "media_files";
   ALTER TABLE "media" DROP COLUMN "_objectkey";`)
}
