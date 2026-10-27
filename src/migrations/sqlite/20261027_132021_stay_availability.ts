import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`stays_availability_calendars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text DEFAULT 'airbnb',
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_availability_calendars_order_idx\` ON \`stays_availability_calendars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_availability_calendars_parent_id_idx\` ON \`stays_availability_calendars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays_availability_blocked\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`from\` text,
  	\`to\` text,
  	\`note\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_availability_blocked_order_idx\` ON \`stays_availability_blocked\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_availability_blocked_parent_id_idx\` ON \`stays_availability_blocked\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_availability_calendars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`platform\` text DEFAULT 'airbnb',
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_availability_calendars_order_idx\` ON \`_stays_v_version_availability_calendars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_availability_calendars_parent_id_idx\` ON \`_stays_v_version_availability_calendars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_availability_blocked\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`from\` text,
  	\`to\` text,
  	\`note\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_availability_blocked_order_idx\` ON \`_stays_v_version_availability_blocked\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_availability_blocked_parent_id_idx\` ON \`_stays_v_version_availability_blocked\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`stays\` ADD \`max_nights\` numeric;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` ADD \`version_max_nights\` numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`stays_availability_calendars\`;`)
  await db.run(sql`DROP TABLE \`stays_availability_blocked\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_availability_calendars\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_availability_blocked\`;`)
  await db.run(sql`ALTER TABLE \`stays\` DROP COLUMN \`max_nights\`;`)
  await db.run(sql`ALTER TABLE \`_stays_v\` DROP COLUMN \`version_max_nights\`;`)
}
