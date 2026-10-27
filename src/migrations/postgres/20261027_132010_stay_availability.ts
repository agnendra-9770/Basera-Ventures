import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stays_availability_calendars_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TYPE "public"."enum__stays_v_version_availability_calendars_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TABLE "stays_availability_calendars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_stays_availability_calendars_platform" DEFAULT 'airbnb',
  	"url" varchar
  );
  
  CREATE TABLE "stays_availability_blocked" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" timestamp(3) with time zone,
  	"to" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "_stays_v_version_availability_calendars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__stays_v_version_availability_calendars_platform" DEFAULT 'airbnb',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v_version_availability_blocked" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" timestamp(3) with time zone,
  	"to" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "stays" ADD COLUMN "max_nights" numeric;
  ALTER TABLE "_stays_v" ADD COLUMN "version_max_nights" numeric;
  ALTER TABLE "stays_availability_calendars" ADD CONSTRAINT "stays_availability_calendars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_availability_blocked" ADD CONSTRAINT "stays_availability_blocked_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_availability_calendars" ADD CONSTRAINT "_stays_v_version_availability_calendars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_availability_blocked" ADD CONSTRAINT "_stays_v_version_availability_blocked_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "stays_availability_calendars_order_idx" ON "stays_availability_calendars" USING btree ("_order");
  CREATE INDEX "stays_availability_calendars_parent_id_idx" ON "stays_availability_calendars" USING btree ("_parent_id");
  CREATE INDEX "stays_availability_blocked_order_idx" ON "stays_availability_blocked" USING btree ("_order");
  CREATE INDEX "stays_availability_blocked_parent_id_idx" ON "stays_availability_blocked" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_availability_calendars_order_idx" ON "_stays_v_version_availability_calendars" USING btree ("_order");
  CREATE INDEX "_stays_v_version_availability_calendars_parent_id_idx" ON "_stays_v_version_availability_calendars" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_availability_blocked_order_idx" ON "_stays_v_version_availability_blocked" USING btree ("_order");
  CREATE INDEX "_stays_v_version_availability_blocked_parent_id_idx" ON "_stays_v_version_availability_blocked" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stays_availability_calendars" CASCADE;
  DROP TABLE "stays_availability_blocked" CASCADE;
  DROP TABLE "_stays_v_version_availability_calendars" CASCADE;
  DROP TABLE "_stays_v_version_availability_blocked" CASCADE;
  ALTER TABLE "stays" DROP COLUMN "max_nights";
  ALTER TABLE "_stays_v" DROP COLUMN "version_max_nights";
  DROP TYPE "public"."enum_stays_availability_calendars_platform";
  DROP TYPE "public"."enum__stays_v_version_availability_calendars_platform";`)
}
