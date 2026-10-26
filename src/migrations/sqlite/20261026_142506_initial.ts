import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`stays_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_highlights_order_idx\` ON \`stays_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_highlights_parent_id_idx\` ON \`stays_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays_moments\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_moments_order_idx\` ON \`stays_moments\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`stays_moments_parent_idx\` ON \`stays_moments\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays_sleeping\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`space\` text,
  	\`beds\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_sleeping_order_idx\` ON \`stays_sleeping\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_sleeping_parent_id_idx\` ON \`stays_sleeping\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays_booking_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_booking_links_order_idx\` ON \`stays_booking_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_booking_links_parent_id_idx\` ON \`stays_booking_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays_house_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rule\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_house_rules_order_idx\` ON \`stays_house_rules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_house_rules_parent_id_idx\` ON \`stays_house_rules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_faqs_order_idx\` ON \`stays_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`stays_faqs_parent_id_idx\` ON \`stays_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`stays\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text,
  	\`slug\` text,
  	\`stay_type\` text DEFAULT 'studio',
  	\`tagline\` text,
  	\`summary\` text,
  	\`description\` text,
  	\`hero_image_id\` integer,
  	\`video_id\` integer,
  	\`max_guests\` numeric,
  	\`bedrooms\` numeric,
  	\`bathrooms\` numeric,
  	\`size\` numeric,
  	\`size_unit\` text DEFAULT 'sqft',
  	\`accessibility\` text,
  	\`price_from\` numeric,
  	\`price_unit\` text DEFAULT 'night',
  	\`rates_checked_on\` text,
  	\`price_note\` text,
  	\`min_nights\` numeric,
  	\`check_in\` text,
  	\`check_out\` text,
  	\`cancellation\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`stays__order_idx\` ON \`stays\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`stays_slug_idx\` ON \`stays\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`stays_hero_image_idx\` ON \`stays\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`stays_video_idx\` ON \`stays\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`stays_seo_seo_image_idx\` ON \`stays\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`stays_updated_at_idx\` ON \`stays\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`stays_created_at_idx\` ON \`stays\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`stays__status_idx\` ON \`stays\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`stays_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`amenities_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`amenities_id\`) REFERENCES \`amenities\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`stays_rels_order_idx\` ON \`stays_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`stays_rels_parent_idx\` ON \`stays_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`stays_rels_path_idx\` ON \`stays_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`stays_rels_media_id_idx\` ON \`stays_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`stays_rels_amenities_id_idx\` ON \`stays_rels\` (\`amenities_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_highlights_order_idx\` ON \`_stays_v_version_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_highlights_parent_id_idx\` ON \`_stays_v_version_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_moments\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_moments_order_idx\` ON \`_stays_v_version_moments\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_moments_parent_idx\` ON \`_stays_v_version_moments\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_sleeping\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`space\` text,
  	\`beds\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_sleeping_order_idx\` ON \`_stays_v_version_sleeping\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_sleeping_parent_id_idx\` ON \`_stays_v_version_sleeping\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_booking_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`platform\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_booking_links_order_idx\` ON \`_stays_v_version_booking_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_booking_links_parent_id_idx\` ON \`_stays_v_version_booking_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_house_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`rule\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_house_rules_order_idx\` ON \`_stays_v_version_house_rules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_house_rules_parent_id_idx\` ON \`_stays_v_version_house_rules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_version_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_version_faqs_order_idx\` ON \`_stays_v_version_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_faqs_parent_id_idx\` ON \`_stays_v_version_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_name\` text,
  	\`version_slug\` text,
  	\`version_stay_type\` text DEFAULT 'studio',
  	\`version_tagline\` text,
  	\`version_summary\` text,
  	\`version_description\` text,
  	\`version_hero_image_id\` integer,
  	\`version_video_id\` integer,
  	\`version_max_guests\` numeric,
  	\`version_bedrooms\` numeric,
  	\`version_bathrooms\` numeric,
  	\`version_size\` numeric,
  	\`version_size_unit\` text DEFAULT 'sqft',
  	\`version_accessibility\` text,
  	\`version_price_from\` numeric,
  	\`version_price_unit\` text DEFAULT 'night',
  	\`version_rates_checked_on\` text,
  	\`version_price_note\` text,
  	\`version_min_nights\` numeric,
  	\`version_check_in\` text,
  	\`version_check_out\` text,
  	\`version_cancellation\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_parent_idx\` ON \`_stays_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version__order_idx\` ON \`_stays_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version_slug_idx\` ON \`_stays_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version_hero_image_idx\` ON \`_stays_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version_video_idx\` ON \`_stays_v\` (\`version_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_seo_version_seo_image_idx\` ON \`_stays_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version_updated_at_idx\` ON \`_stays_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version_created_at_idx\` ON \`_stays_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_version_version__status_idx\` ON \`_stays_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_created_at_idx\` ON \`_stays_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_updated_at_idx\` ON \`_stays_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_latest_idx\` ON \`_stays_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_stays_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`amenities_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_stays_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`amenities_id\`) REFERENCES \`amenities\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_stays_v_rels_order_idx\` ON \`_stays_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_rels_parent_idx\` ON \`_stays_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_rels_path_idx\` ON \`_stays_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_rels_media_id_idx\` ON \`_stays_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`_stays_v_rels_amenities_id_idx\` ON \`_stays_v_rels\` (\`amenities_id\`);`)
  await db.run(sql`CREATE TABLE \`amenities\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text NOT NULL,
  	\`note\` text,
  	\`category\` text NOT NULL,
  	\`icon\` text,
  	\`shared\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`amenities__order_idx\` ON \`amenities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`amenities_updated_at_idx\` ON \`amenities\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`amenities_created_at_idx\` ON \`amenities\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`experiences_moments\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`experiences\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`experiences_moments_order_idx\` ON \`experiences_moments\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`experiences_moments_parent_idx\` ON \`experiences_moments\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`experiences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`title\` text,
  	\`slug\` text,
  	\`kind\` text DEFAULT 'onsite',
  	\`summary\` text,
  	\`body\` text,
  	\`image_id\` integer,
  	\`detail_image_id\` integer,
  	\`details_when\` text,
  	\`details_duration\` text,
  	\`details_distance\` text,
  	\`details_price\` text,
  	\`details_booking\` text,
  	\`featured\` integer DEFAULT false,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`detail_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`experiences__order_idx\` ON \`experiences\` (\`_order\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`experiences_slug_idx\` ON \`experiences\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`experiences_image_idx\` ON \`experiences\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`experiences_detail_image_idx\` ON \`experiences\` (\`detail_image_id\`);`)
  await db.run(sql`CREATE INDEX \`experiences_updated_at_idx\` ON \`experiences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`experiences_created_at_idx\` ON \`experiences\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`experiences__status_idx\` ON \`experiences\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`experiences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`stays_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`experiences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stays_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`experiences_rels_order_idx\` ON \`experiences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`experiences_rels_parent_idx\` ON \`experiences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`experiences_rels_path_idx\` ON \`experiences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`experiences_rels_stays_id_idx\` ON \`experiences_rels\` (\`stays_id\`);`)
  await db.run(sql`CREATE TABLE \`_experiences_v_version_moments\` (
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`value\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_experiences_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_moments_order_idx\` ON \`_experiences_v_version_moments\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_moments_parent_idx\` ON \`_experiences_v_version_moments\` (\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_experiences_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version__order\` text,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_kind\` text DEFAULT 'onsite',
  	\`version_summary\` text,
  	\`version_body\` text,
  	\`version_image_id\` integer,
  	\`version_detail_image_id\` integer,
  	\`version_details_when\` text,
  	\`version_details_duration\` text,
  	\`version_details_distance\` text,
  	\`version_details_price\` text,
  	\`version_details_booking\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`experiences\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_detail_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_experiences_v_parent_idx\` ON \`_experiences_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version__order_idx\` ON \`_experiences_v\` (\`version__order\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version_slug_idx\` ON \`_experiences_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version_image_idx\` ON \`_experiences_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version_detail_image_idx\` ON \`_experiences_v\` (\`version_detail_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version_updated_at_idx\` ON \`_experiences_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version_created_at_idx\` ON \`_experiences_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_version_version__status_idx\` ON \`_experiences_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_created_at_idx\` ON \`_experiences_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_updated_at_idx\` ON \`_experiences_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_latest_idx\` ON \`_experiences_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_experiences_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`stays_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_experiences_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stays_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_experiences_v_rels_order_idx\` ON \`_experiences_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_rels_parent_idx\` ON \`_experiences_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_rels_path_idx\` ON \`_experiences_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_experiences_v_rels_stays_id_idx\` ON \`_experiences_v_rels\` (\`stays_id\`);`)
  await db.run(sql`CREATE TABLE \`journal\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`cover_image_id\` integer,
  	\`body\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer,
  	\`category\` text DEFAULT 'notes',
  	\`published_at\` text,
  	\`author\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`journal_slug_idx\` ON \`journal\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`journal_cover_image_idx\` ON \`journal\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`journal_seo_seo_image_idx\` ON \`journal\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`journal_updated_at_idx\` ON \`journal\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`journal_created_at_idx\` ON \`journal\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`journal__status_idx\` ON \`journal\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`journal_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`stays_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`journal\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stays_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`journal_rels_order_idx\` ON \`journal_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`journal_rels_parent_idx\` ON \`journal_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`journal_rels_path_idx\` ON \`journal_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`journal_rels_stays_id_idx\` ON \`journal_rels\` (\`stays_id\`);`)
  await db.run(sql`CREATE TABLE \`_journal_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_cover_image_id\` integer,
  	\`version_body\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_image_id\` integer,
  	\`version_seo_noindex\` integer,
  	\`version_category\` text DEFAULT 'notes',
  	\`version_published_at\` text,
  	\`version_author\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`journal\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_journal_v_parent_idx\` ON \`_journal_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_version_version_slug_idx\` ON \`_journal_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_version_version_cover_image_idx\` ON \`_journal_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_version_seo_version_seo_image_idx\` ON \`_journal_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_version_version_updated_at_idx\` ON \`_journal_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_version_version_created_at_idx\` ON \`_journal_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_version_version__status_idx\` ON \`_journal_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_created_at_idx\` ON \`_journal_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_updated_at_idx\` ON \`_journal_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_latest_idx\` ON \`_journal_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_journal_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`stays_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_journal_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stays_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_journal_v_rels_order_idx\` ON \`_journal_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_rels_parent_idx\` ON \`_journal_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_rels_path_idx\` ON \`_journal_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_journal_v_rels_stays_id_idx\` ON \`_journal_v_rels\` (\`stays_id\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`quote\` text NOT NULL,
  	\`guest_name\` text NOT NULL,
  	\`guest_from\` text,
  	\`stayed_in\` text,
  	\`source\` text NOT NULL,
  	\`source_url\` text,
  	\`rating\` numeric,
  	\`stay_id\` integer,
  	\`consent\` integer,
  	\`verified\` integer DEFAULT false,
  	\`featured\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`stay_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials__order_idx\` ON \`testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_stay_idx\` ON \`testimonials\` (\`stay_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`category\` text DEFAULT 'stay' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs__order_idx\` ON \`faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`places\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`name\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`description\` text,
  	\`tip\` text,
  	\`direction\` text NOT NULL,
  	\`travel_minutes\` numeric NOT NULL,
  	\`mode\` text DEFAULT 'car',
  	\`distance_km\` numeric,
  	\`maps_url\` text,
  	\`image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`places__order_idx\` ON \`places\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`places_image_idx\` ON \`places\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`places_updated_at_idx\` ON \`places\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`places_created_at_idx\` ON \`places\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`inquiries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`status\` text DEFAULT 'new',
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`check_in\` text,
  	\`check_out\` text,
  	\`adults\` numeric,
  	\`children\` numeric,
  	\`stay_id\` integer,
  	\`message\` text,
  	\`preferred_contact\` text,
  	\`notes\` text,
  	\`consent\` integer,
  	\`source_page\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`stay_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`inquiries_stay_idx\` ON \`inquiries\` (\`stay_id\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_updated_at_idx\` ON \`inquiries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`inquiries_created_at_idx\` ON \`inquiries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_order\` text,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`category\` text,
  	\`show_in_gallery\` integer DEFAULT true,
  	\`postcard\` integer DEFAULT false,
  	\`credit\` text,
  	\`poster_id\` integer,
  	\`blur_data_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`media__order_idx\` ON \`media\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`media_poster_idx\` ON \`media\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`stays_id\` integer,
  	\`amenities_id\` integer,
  	\`experiences_id\` integer,
  	\`journal_id\` integer,
  	\`testimonials_id\` integer,
  	\`faqs_id\` integer,
  	\`places_id\` integer,
  	\`inquiries_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`stays_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`amenities_id\`) REFERENCES \`amenities\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experiences_id\`) REFERENCES \`experiences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`journal_id\`) REFERENCES \`journal\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`places_id\`) REFERENCES \`places\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`inquiries_id\`) REFERENCES \`inquiries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_stays_id_idx\` ON \`payload_locked_documents_rels\` (\`stays_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_amenities_id_idx\` ON \`payload_locked_documents_rels\` (\`amenities_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_experiences_id_idx\` ON \`payload_locked_documents_rels\` (\`experiences_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_journal_id_idx\` ON \`payload_locked_documents_rels\` (\`journal_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_places_id_idx\` ON \`payload_locked_documents_rels\` (\`places_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_inquiries_id_idx\` ON \`payload_locked_documents_rels\` (\`inquiries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`home_story_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_story_lines_order_idx\` ON \`home_story_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_story_lines_parent_id_idx\` ON \`home_story_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_moments_items_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_moments_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_moments_items_highlights_order_idx\` ON \`home_moments_items_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_moments_items_highlights_parent_id_idx\` ON \`home_moments_items_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`home_moments_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`image_id\` integer,
  	\`stay_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`stay_id\`) REFERENCES \`stays\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_moments_items_order_idx\` ON \`home_moments_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_moments_items_parent_id_idx\` ON \`home_moments_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_moments_items_image_idx\` ON \`home_moments_items\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_moments_items_stay_idx\` ON \`home_moments_items\` (\`stay_id\`);`)
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_headline\` text NOT NULL,
  	\`hero_subheadline\` text,
  	\`hero_image_id\` integer,
  	\`hero_mobile_image_id\` integer,
  	\`hero_video_id\` integer,
  	\`hero_primary_label\` text DEFAULT 'Explore the Stay',
  	\`hero_secondary_label\` text DEFAULT 'Check Availability',
  	\`story_eyebrow\` text,
  	\`story_heading\` text,
  	\`story_intro\` text,
  	\`story_image_id\` integer,
  	\`story_detail_image_id\` integer,
  	\`story_link_label\` text DEFAULT 'Read our story',
  	\`moments_eyebrow\` text,
  	\`moments_heading\` text,
  	\`moments_intro\` text,
  	\`signature_eyebrow\` text,
  	\`signature_heading\` text,
  	\`signature_intro\` text,
  	\`day_eyebrow\` text,
  	\`day_heading\` text,
  	\`day_intro\` text,
  	\`collage_eyebrow\` text,
  	\`collage_heading\` text,
  	\`collage_intro\` text,
  	\`stories_eyebrow\` text,
  	\`stories_heading\` text,
  	\`destination_eyebrow\` text,
  	\`destination_heading\` text,
  	\`destination_intro\` text,
  	\`destination_image_id\` integer,
  	\`invitation_eyebrow\` text,
  	\`invitation_heading\` text,
  	\`invitation_intro\` text,
  	\`invitation_image_id\` integer,
  	\`invitation_button_label\` text DEFAULT 'Check Availability',
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_mobile_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`story_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`story_detail_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`destination_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`invitation_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`home_hero_hero_image_idx\` ON \`home\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_hero_hero_mobile_image_idx\` ON \`home\` (\`hero_mobile_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_hero_hero_video_idx\` ON \`home\` (\`hero_video_id\`);`)
  await db.run(sql`CREATE INDEX \`home_story_story_image_idx\` ON \`home\` (\`story_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_story_story_detail_image_idx\` ON \`home\` (\`story_detail_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_destination_destination_image_idx\` ON \`home\` (\`destination_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_invitation_invitation_image_idx\` ON \`home\` (\`invitation_image_id\`);`)
  await db.run(sql`CREATE INDEX \`home_seo_seo_image_idx\` ON \`home\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`home_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`experiences_id\` integer,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`experiences_id\`) REFERENCES \`experiences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`home_rels_order_idx\` ON \`home_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_parent_idx\` ON \`home_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_path_idx\` ON \`home_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_experiences_id_idx\` ON \`home_rels\` (\`experiences_id\`);`)
  await db.run(sql`CREATE INDEX \`home_rels_media_id_idx\` ON \`home_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`story_people_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text,
  	\`photo_id\` integer,
  	\`bio\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`story_people_members_order_idx\` ON \`story_people_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`story_people_members_parent_id_idx\` ON \`story_people_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`story_people_members_photo_idx\` ON \`story_people_members\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`story_philosophy_pillars\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`story_philosophy_pillars_order_idx\` ON \`story_philosophy_pillars\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`story_philosophy_pillars_parent_id_idx\` ON \`story_philosophy_pillars\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`story_philosophy_pillars_image_idx\` ON \`story_philosophy_pillars\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`story_timeline_entries\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`year\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`story_timeline_entries_order_idx\` ON \`story_timeline_entries\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`story_timeline_entries_parent_id_idx\` ON \`story_timeline_entries\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`story_timeline_entries_image_idx\` ON \`story_timeline_entries\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`story_promise_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`story_promise_items_order_idx\` ON \`story_promise_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`story_promise_items_parent_id_idx\` ON \`story_promise_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`story\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_intro\` text,
  	\`hero_image_id\` integer,
  	\`people_heading\` text,
  	\`people_text\` text,
  	\`people_image_id\` integer,
  	\`philosophy_eyebrow\` text,
  	\`philosophy_heading\` text,
  	\`philosophy_intro\` text,
  	\`local_heading\` text,
  	\`local_text\` text,
  	\`local_image_id\` integer,
  	\`timeline_heading\` text,
  	\`promise_heading\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`people_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`local_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`story_hero_hero_image_idx\` ON \`story\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`story_people_people_image_idx\` ON \`story\` (\`people_image_id\`);`)
  await db.run(sql`CREATE INDEX \`story_local_local_image_idx\` ON \`story\` (\`local_image_id\`);`)
  await db.run(sql`CREATE INDEX \`story_seo_seo_image_idx\` ON \`story\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`day_moments\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`time\` text NOT NULL,
  	\`time_label\` text,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`day\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`day_moments_order_idx\` ON \`day_moments\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`day_moments_parent_id_idx\` ON \`day_moments\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`day_moments_image_idx\` ON \`day_moments\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`day\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`intro_eyebrow\` text,
  	\`intro_heading\` text,
  	\`intro_intro\` text,
  	\`closing_heading\` text,
  	\`closing_text\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`day_seo_seo_image_idx\` ON \`day\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_contact_next_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_contact_next_steps_order_idx\` ON \`pages_contact_next_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_contact_next_steps_parent_id_idx\` ON \`pages_contact_next_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`stays_eyebrow\` text,
  	\`stays_heading\` text,
  	\`stays_intro\` text,
  	\`stays_image_id\` integer,
  	\`stays_seo_title\` text,
  	\`stays_seo_description\` text,
  	\`stays_seo_image_id\` integer,
  	\`stays_seo_noindex\` integer,
  	\`experiences_eyebrow\` text,
  	\`experiences_heading\` text,
  	\`experiences_intro\` text,
  	\`experiences_image_id\` integer,
  	\`experiences_seo_title\` text,
  	\`experiences_seo_description\` text,
  	\`experiences_seo_image_id\` integer,
  	\`experiences_seo_noindex\` integer,
  	\`gallery_eyebrow\` text,
  	\`gallery_heading\` text,
  	\`gallery_intro\` text,
  	\`gallery_image_id\` integer,
  	\`gallery_postcards_heading\` text,
  	\`gallery_postcards_intro\` text,
  	\`gallery_seo_title\` text,
  	\`gallery_seo_description\` text,
  	\`gallery_seo_image_id\` integer,
  	\`gallery_seo_noindex\` integer,
  	\`journal_eyebrow\` text,
  	\`journal_heading\` text,
  	\`journal_intro\` text,
  	\`journal_image_id\` integer,
  	\`journal_seo_title\` text,
  	\`journal_seo_description\` text,
  	\`journal_seo_image_id\` integer,
  	\`journal_seo_noindex\` integer,
  	\`faqs_eyebrow\` text,
  	\`faqs_heading\` text,
  	\`faqs_intro\` text,
  	\`faqs_image_id\` integer,
  	\`faqs_seo_title\` text,
  	\`faqs_seo_description\` text,
  	\`faqs_seo_image_id\` integer,
  	\`faqs_seo_noindex\` integer,
  	\`contact_eyebrow\` text,
  	\`contact_heading\` text,
  	\`contact_intro\` text,
  	\`contact_image_id\` integer,
  	\`contact_seo_title\` text,
  	\`contact_seo_description\` text,
  	\`contact_seo_image_id\` integer,
  	\`contact_seo_noindex\` integer,
  	\`privacy_eyebrow\` text,
  	\`privacy_heading\` text,
  	\`privacy_intro\` text,
  	\`privacy_image_id\` integer,
  	\`privacy_body\` text,
  	\`privacy_seo_title\` text,
  	\`privacy_seo_description\` text,
  	\`privacy_seo_image_id\` integer,
  	\`privacy_seo_noindex\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`stays_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`stays_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`experiences_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`experiences_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`gallery_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`gallery_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`journal_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`journal_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`faqs_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`faqs_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`contact_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`contact_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`privacy_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`privacy_seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_stays_stays_image_idx\` ON \`pages\` (\`stays_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_stays_seo_stays_seo_image_idx\` ON \`pages\` (\`stays_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_experiences_experiences_image_idx\` ON \`pages\` (\`experiences_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_experiences_seo_experiences_seo_image_idx\` ON \`pages\` (\`experiences_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_gallery_gallery_image_idx\` ON \`pages\` (\`gallery_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_gallery_seo_gallery_seo_image_idx\` ON \`pages\` (\`gallery_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_journal_journal_image_idx\` ON \`pages\` (\`journal_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_journal_seo_journal_seo_image_idx\` ON \`pages\` (\`journal_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_faqs_faqs_image_idx\` ON \`pages\` (\`faqs_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_faqs_seo_faqs_seo_image_idx\` ON \`pages\` (\`faqs_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_contact_contact_image_idx\` ON \`pages\` (\`contact_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_contact_seo_contact_seo_image_idx\` ON \`pages\` (\`contact_seo_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_privacy_privacy_image_idx\` ON \`pages\` (\`privacy_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_privacy_seo_privacy_seo_image_idx\` ON \`pages\` (\`privacy_seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`destination_getting_here_routes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`mode\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`destination\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`destination_getting_here_routes_order_idx\` ON \`destination_getting_here_routes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`destination_getting_here_routes_parent_id_idx\` ON \`destination_getting_here_routes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`destination_seasons_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`months\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`destination\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`destination_seasons_items_order_idx\` ON \`destination_seasons_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`destination_seasons_items_parent_id_idx\` ON \`destination_seasons_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`destination_practical_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`destination\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`destination_practical_items_order_idx\` ON \`destination_practical_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`destination_practical_items_parent_id_idx\` ON \`destination_practical_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`destination\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_eyebrow\` text,
  	\`hero_heading\` text,
  	\`hero_intro\` text,
  	\`hero_image_id\` integer,
  	\`getting_here_eyebrow\` text,
  	\`getting_here_heading\` text,
  	\`getting_here_intro\` text,
  	\`explorer_eyebrow\` text,
  	\`explorer_heading\` text,
  	\`explorer_intro\` text,
  	\`seasons_eyebrow\` text,
  	\`seasons_heading\` text,
  	\`seasons_intro\` text,
  	\`practical_heading\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_image_id\` integer,
  	\`seo_noindex\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`destination_hero_hero_image_idx\` ON \`destination\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`destination_seo_seo_image_idx\` ON \`destination\` (\`seo_image_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_booking_channels\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_booking_channels_order_idx\` ON \`settings_booking_channels\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_booking_channels_parent_id_idx\` ON \`settings_booking_channels\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_policies_house_rules\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`rule\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_policies_house_rules_order_idx\` ON \`settings_policies_house_rules\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_policies_house_rules_parent_id_idx\` ON \`settings_policies_house_rules\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand_name\` text DEFAULT '[BRAND NAME]' NOT NULL,
  	\`property_type\` text DEFAULT '[PROPERTY TYPE]' NOT NULL,
  	\`usp\` text DEFAULT '[PROPERTY USP]',
  	\`tagline\` text,
  	\`logo_id\` integer,
  	\`logo_on_dark_id\` integer,
  	\`location\` text DEFAULT '[CITY / REGION]' NOT NULL,
  	\`nearby_city\` text DEFAULT '[NEARBY CITY]',
  	\`address_street\` text,
  	\`address_locality\` text,
  	\`address_city\` text,
  	\`address_region\` text,
  	\`address_postal_code\` text,
  	\`address_country\` text DEFAULT 'India',
  	\`geo_latitude\` numeric,
  	\`geo_longitude\` numeric,
  	\`maps_url\` text,
  	\`map_embed_url\` text,
  	\`contact_phone\` text,
  	\`contact_whatsapp\` text,
  	\`contact_email\` text,
  	\`contact_response_time\` text DEFAULT '[RESPONSE TIME]',
  	\`contact_hours\` text,
  	\`booking_mode\` text DEFAULT 'inquiry' NOT NULL,
  	\`booking_engine_url\` text,
  	\`booking_whatsapp_message\` text DEFAULT 'Hello! I would like to ask about staying at {brand}.',
  	\`booking_currency\` text DEFAULT 'INR',
  	\`booking_payment_note\` text DEFAULT '[PAYMENT TERMS — e.g. an advance by UPI or bank transfer confirms your booking]',
  	\`policies_check_in\` text DEFAULT '[CHECK-IN TIME]',
  	\`policies_check_out\` text DEFAULT '[CHECK-OUT TIME]',
  	\`policies_cancellation\` text DEFAULT '[CANCELLATION POLICY]',
  	\`policies_children\` text DEFAULT '[CHILD POLICY]',
  	\`policies_pets\` text DEFAULT '[PET POLICY]',
  	\`policies_id_requirements\` text DEFAULT '[ID REQUIREMENTS]',
  	\`social_instagram\` text,
  	\`social_facebook\` text,
  	\`social_youtube\` text,
  	\`social_google_business\` text,
  	\`social_tripadvisor\` text,
  	\`seo_is_live\` integer DEFAULT false,
  	\`seo_business_type\` text DEFAULT 'LodgingBusiness',
  	\`seo_default_description\` text DEFAULT '{brand} is a {propertyType} in {location} — warm-lit studios with kitchenettes, a courtyard pool and a dining room. Book direct with the hosts.',
  	\`seo_share_image_id\` integer,
  	\`seo_google_verification\` text,
  	\`seo_bing_verification\` text,
  	\`seo_ga4_id\` text,
  	\`seo_vacation_rental\` integer DEFAULT false,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_on_dark_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_share_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_logo_idx\` ON \`settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_logo_on_dark_idx\` ON \`settings\` (\`logo_on_dark_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_seo_seo_share_image_idx\` ON \`settings\` (\`seo_share_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`stays_highlights\`;`)
  await db.run(sql`DROP TABLE \`stays_moments\`;`)
  await db.run(sql`DROP TABLE \`stays_sleeping\`;`)
  await db.run(sql`DROP TABLE \`stays_booking_links\`;`)
  await db.run(sql`DROP TABLE \`stays_house_rules\`;`)
  await db.run(sql`DROP TABLE \`stays_faqs\`;`)
  await db.run(sql`DROP TABLE \`stays\`;`)
  await db.run(sql`DROP TABLE \`stays_rels\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_highlights\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_moments\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_sleeping\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_booking_links\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_house_rules\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_version_faqs\`;`)
  await db.run(sql`DROP TABLE \`_stays_v\`;`)
  await db.run(sql`DROP TABLE \`_stays_v_rels\`;`)
  await db.run(sql`DROP TABLE \`amenities\`;`)
  await db.run(sql`DROP TABLE \`experiences_moments\`;`)
  await db.run(sql`DROP TABLE \`experiences\`;`)
  await db.run(sql`DROP TABLE \`experiences_rels\`;`)
  await db.run(sql`DROP TABLE \`_experiences_v_version_moments\`;`)
  await db.run(sql`DROP TABLE \`_experiences_v\`;`)
  await db.run(sql`DROP TABLE \`_experiences_v_rels\`;`)
  await db.run(sql`DROP TABLE \`journal\`;`)
  await db.run(sql`DROP TABLE \`journal_rels\`;`)
  await db.run(sql`DROP TABLE \`_journal_v\`;`)
  await db.run(sql`DROP TABLE \`_journal_v_rels\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`places\`;`)
  await db.run(sql`DROP TABLE \`inquiries\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`home_story_lines\`;`)
  await db.run(sql`DROP TABLE \`home_moments_items_highlights\`;`)
  await db.run(sql`DROP TABLE \`home_moments_items\`;`)
  await db.run(sql`DROP TABLE \`home\`;`)
  await db.run(sql`DROP TABLE \`home_rels\`;`)
  await db.run(sql`DROP TABLE \`story_people_members\`;`)
  await db.run(sql`DROP TABLE \`story_philosophy_pillars\`;`)
  await db.run(sql`DROP TABLE \`story_timeline_entries\`;`)
  await db.run(sql`DROP TABLE \`story_promise_items\`;`)
  await db.run(sql`DROP TABLE \`story\`;`)
  await db.run(sql`DROP TABLE \`day_moments\`;`)
  await db.run(sql`DROP TABLE \`day\`;`)
  await db.run(sql`DROP TABLE \`pages_contact_next_steps\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`destination_getting_here_routes\`;`)
  await db.run(sql`DROP TABLE \`destination_seasons_items\`;`)
  await db.run(sql`DROP TABLE \`destination_practical_items\`;`)
  await db.run(sql`DROP TABLE \`destination\`;`)
  await db.run(sql`DROP TABLE \`settings_booking_channels\`;`)
  await db.run(sql`DROP TABLE \`settings_policies_house_rules\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
}
