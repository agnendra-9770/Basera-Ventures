import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`stays_nearby\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`place\` text,
  	\`distance\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_nearby_order_idx\` ON \`stays_nearby\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_nearby_parent_id_idx\` ON \`stays_nearby\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_nearby\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`place\` text,
  	\`distance\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_nearby_order_idx\` ON \`_stays_v_version_nearby\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_nearby_parent_id_idx\` ON \`_stays_v_version_nearby\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`area\` text;`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`location_note\` text;`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`rating_score\` numeric;`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`rating_count\` numeric;`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`rating_platform\` text DEFAULT 'airbnb';`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`rating_badge\` text;`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`rating_checked_on\` text;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_area\` text;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_location_note\` text;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_rating_score\` numeric;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_rating_count\` numeric;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_rating_platform\` text DEFAULT 'airbnb';`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_rating_badge\` text;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_rating_checked_on\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`stays_nearby\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_nearby\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`area\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`location_note\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`rating_score\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`rating_count\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`rating_platform\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`rating_badge\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`rating_checked_on\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_area\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_location_note\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_rating_score\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_rating_count\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_rating_platform\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_rating_badge\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_rating_checked_on\`;`)
}
