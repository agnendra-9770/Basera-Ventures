import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_stays_moments" AS ENUM('couples', 'families', 'groups', 'remote', 'corporate', 'longstay', 'shoots', 'solo');
  CREATE TYPE "public"."enum_stays_booking_links_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TYPE "public"."enum_stays_stay_type" AS ENUM('studio', 'room', 'suite', 'apartment', 'villa', 'cottage', 'homestay', 'other');
  CREATE TYPE "public"."enum_stays_size_unit" AS ENUM('sqft', 'sqm');
  CREATE TYPE "public"."enum_stays_price_unit" AS ENUM('night', 'week', 'month');
  CREATE TYPE "public"."enum_stays_rating_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TYPE "public"."enum_stays_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stays_v_version_moments" AS ENUM('couples', 'families', 'groups', 'remote', 'corporate', 'longstay', 'shoots', 'solo');
  CREATE TYPE "public"."enum__stays_v_version_booking_links_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TYPE "public"."enum__stays_v_version_stay_type" AS ENUM('studio', 'room', 'suite', 'apartment', 'villa', 'cottage', 'homestay', 'other');
  CREATE TYPE "public"."enum__stays_v_version_size_unit" AS ENUM('sqft', 'sqm');
  CREATE TYPE "public"."enum__stays_v_version_price_unit" AS ENUM('night', 'week', 'month');
  CREATE TYPE "public"."enum__stays_v_version_rating_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TYPE "public"."enum__stays_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_amenities_category" AS ENUM('comfort', 'kitchen', 'work', 'bath', 'entertainment', 'safety', 'family', 'leisure', 'access', 'services');
  CREATE TYPE "public"."enum_amenities_icon" AS ENUM('bed', 'guests', 'bath', 'size', 'kitchen', 'kettle', 'fridge', 'microwave', 'desk', 'tv', 'wardrobe', 'sofa', 'mirror', 'fan', 'ac', 'lock', 'wifi', 'pool', 'dining', 'coffee', 'parking', 'lift', 'balcony', 'garden', 'washer', 'iron', 'towel', 'child', 'accessible', 'pet', 'no-smoking', 'safe', 'first-aid', 'sun', 'moon', 'leaf', 'sparkle', 'lamp', 'gym', 'ev', 'key', 'camera', 'delivery', 'door');
  CREATE TYPE "public"."enum_experiences_moments" AS ENUM('couples', 'families', 'groups', 'remote', 'corporate', 'longstay', 'shoots', 'solo');
  CREATE TYPE "public"."enum_experiences_kind" AS ENUM('onsite', 'nearby', 'arranged', 'seasonal');
  CREATE TYPE "public"."enum_experiences_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experiences_v_version_moments" AS ENUM('couples', 'families', 'groups', 'remote', 'corporate', 'longstay', 'shoots', 'solo');
  CREATE TYPE "public"."enum__experiences_v_version_kind" AS ENUM('onsite', 'nearby', 'arranged', 'seasonal');
  CREATE TYPE "public"."enum__experiences_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_journal_category" AS ENUM('guide', 'stay', 'seasonal', 'people', 'notes');
  CREATE TYPE "public"."enum_journal_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_v_version_category" AS ENUM('guide', 'stay', 'seasonal', 'people', 'notes');
  CREATE TYPE "public"."enum__journal_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_source" AS ENUM('google', 'airbnb', 'booking', 'tripadvisor', 'agoda', 'makemytrip', 'direct', 'other');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('booking', 'arrival', 'stay', 'food', 'location', 'policies');
  CREATE TYPE "public"."enum_places_category" AS ENUM('sight', 'nature', 'food', 'culture', 'shopping', 'wellness', 'transport', 'essentials');
  CREATE TYPE "public"."enum_places_direction" AS ENUM('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');
  CREATE TYPE "public"."enum_places_mode" AS ENUM('walk', 'car', 'auto', 'train', 'plane');
  CREATE TYPE "public"."enum_inquiries_status" AS ENUM('new', 'replied', 'confirmed', 'declined', 'closed');
  CREATE TYPE "public"."enum_inquiries_preferred_contact" AS ENUM('email', 'phone', 'whatsapp');
  CREATE TYPE "public"."enum_media_category" AS ENUM('studios', 'bath', 'pool', 'dining', 'spaces', 'details', 'destination', 'people', 'exterior', 'other');
  CREATE TYPE "public"."enum_day_moments_time" AS ENUM('dawn', 'morning', 'midday', 'afternoon', 'golden', 'evening', 'night');
  CREATE TYPE "public"."enum_destination_getting_here_routes_mode" AS ENUM('plane', 'train', 'car', 'walk');
  CREATE TYPE "public"."enum_settings_booking_channels_platform" AS ENUM('airbnb', 'booking', 'agoda', 'makemytrip', 'goibibo', 'vrbo', 'direct', 'other');
  CREATE TYPE "public"."enum_settings_booking_mode" AS ENUM('inquiry', 'engine');
  CREATE TYPE "public"."enum_settings_booking_currency" AS ENUM('INR', 'USD', 'EUR', 'GBP', 'AED');
  CREATE TYPE "public"."enum_settings_seo_business_type" AS ENUM('LodgingBusiness', 'BedAndBreakfast', 'Hotel', 'Resort', 'Hostel');
  CREATE TABLE "stays_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "stays_moments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stays_moments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "stays_nearby" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"place" varchar,
  	"distance" varchar
  );
  
  CREATE TABLE "stays_sleeping" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"space" varchar,
  	"beds" varchar
  );
  
  CREATE TABLE "stays_booking_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_stays_booking_links_platform",
  	"url" varchar
  );
  
  CREATE TABLE "stays_house_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rule" varchar
  );
  
  CREATE TABLE "stays_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "stays" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar,
  	"slug" varchar,
  	"stay_type" "enum_stays_stay_type" DEFAULT 'studio',
  	"tagline" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"area" varchar,
  	"location_note" varchar,
  	"hero_image_id" integer,
  	"video_id" integer,
  	"max_guests" numeric,
  	"bedrooms" numeric,
  	"bathrooms" numeric,
  	"size" numeric,
  	"size_unit" "enum_stays_size_unit" DEFAULT 'sqft',
  	"accessibility" varchar,
  	"price_from" numeric,
  	"price_unit" "enum_stays_price_unit" DEFAULT 'night',
  	"rates_checked_on" timestamp(3) with time zone,
  	"price_note" varchar,
  	"min_nights" numeric,
  	"rating_score" numeric,
  	"rating_count" numeric,
  	"rating_platform" "enum_stays_rating_platform" DEFAULT 'airbnb',
  	"rating_badge" varchar,
  	"rating_checked_on" timestamp(3) with time zone,
  	"check_in" varchar,
  	"check_out" varchar,
  	"cancellation" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stays_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "stays_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"amenities_id" integer
  );
  
  CREATE TABLE "_stays_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v_version_moments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__stays_v_version_moments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_stays_v_version_nearby" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"place" varchar,
  	"distance" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v_version_sleeping" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"space" varchar,
  	"beds" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v_version_booking_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__stays_v_version_booking_links_platform",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v_version_house_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rule" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stays_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_stay_type" "enum__stays_v_version_stay_type" DEFAULT 'studio',
  	"version_tagline" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_area" varchar,
  	"version_location_note" varchar,
  	"version_hero_image_id" integer,
  	"version_video_id" integer,
  	"version_max_guests" numeric,
  	"version_bedrooms" numeric,
  	"version_bathrooms" numeric,
  	"version_size" numeric,
  	"version_size_unit" "enum__stays_v_version_size_unit" DEFAULT 'sqft',
  	"version_accessibility" varchar,
  	"version_price_from" numeric,
  	"version_price_unit" "enum__stays_v_version_price_unit" DEFAULT 'night',
  	"version_rates_checked_on" timestamp(3) with time zone,
  	"version_price_note" varchar,
  	"version_min_nights" numeric,
  	"version_rating_score" numeric,
  	"version_rating_count" numeric,
  	"version_rating_platform" "enum__stays_v_version_rating_platform" DEFAULT 'airbnb',
  	"version_rating_badge" varchar,
  	"version_rating_checked_on" timestamp(3) with time zone,
  	"version_check_in" varchar,
  	"version_check_out" varchar,
  	"version_cancellation" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stays_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_stays_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"amenities_id" integer
  );
  
  CREATE TABLE "amenities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"note" varchar,
  	"category" "enum_amenities_category" NOT NULL,
  	"icon" "enum_amenities_icon",
  	"shared" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "experiences_moments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_experiences_moments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"kind" "enum_experiences_kind" DEFAULT 'onsite',
  	"summary" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"detail_image_id" integer,
  	"details_when" varchar,
  	"details_duration" varchar,
  	"details_distance" varchar,
  	"details_price" varchar,
  	"details_booking" varchar,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_experiences_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "experiences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stays_id" integer
  );
  
  CREATE TABLE "_experiences_v_version_moments" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__experiences_v_version_moments",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_experiences_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_kind" "enum__experiences_v_version_kind" DEFAULT 'onsite',
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_image_id" integer,
  	"version_detail_image_id" integer,
  	"version_details_when" varchar,
  	"version_details_duration" varchar,
  	"version_details_distance" varchar,
  	"version_details_price" varchar,
  	"version_details_booking" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__experiences_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_experiences_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stays_id" integer
  );
  
  CREATE TABLE "journal" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"cover_image_id" integer,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean,
  	"category" "enum_journal_category" DEFAULT 'notes',
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "journal_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stays_id" integer
  );
  
  CREATE TABLE "_journal_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_cover_image_id" integer,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_category" "enum__journal_v_version_category" DEFAULT 'notes',
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_journal_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stays_id" integer
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"quote" varchar NOT NULL,
  	"guest_name" varchar NOT NULL,
  	"guest_from" varchar,
  	"stayed_in" varchar,
  	"source" "enum_testimonials_source" NOT NULL,
  	"source_url" varchar,
  	"rating" numeric,
  	"stay_id" integer,
  	"consent" boolean,
  	"verified" boolean DEFAULT false,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faqs_category" DEFAULT 'stay' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"category" "enum_places_category" NOT NULL,
  	"description" varchar,
  	"tip" varchar,
  	"direction" "enum_places_direction" NOT NULL,
  	"travel_minutes" numeric NOT NULL,
  	"mode" "enum_places_mode" DEFAULT 'car',
  	"distance_km" numeric,
  	"maps_url" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_inquiries_status" DEFAULT 'new',
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"check_in" timestamp(3) with time zone,
  	"check_out" timestamp(3) with time zone,
  	"adults" numeric,
  	"children" numeric,
  	"stay_id" integer,
  	"message" varchar,
  	"preferred_contact" "enum_inquiries_preferred_contact",
  	"notes" varchar,
  	"consent" boolean,
  	"source_page" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"category" "enum_media_category",
  	"show_in_gallery" boolean DEFAULT true,
  	"postcard" boolean DEFAULT false,
  	"credit" varchar,
  	"poster_id" integer,
  	"blur_data_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"stays_id" integer,
  	"amenities_id" integer,
  	"experiences_id" integer,
  	"journal_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"places_id" integer,
  	"inquiries_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_story_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_moments_items_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "home_moments_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" integer,
  	"stay_id" integer
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar NOT NULL,
  	"hero_subheadline" varchar,
  	"hero_image_id" integer,
  	"hero_mobile_image_id" integer,
  	"hero_video_id" integer,
  	"hero_primary_label" varchar DEFAULT 'Explore the Stay',
  	"hero_secondary_label" varchar DEFAULT 'Check Availability',
  	"story_eyebrow" varchar,
  	"story_heading" varchar,
  	"story_intro" varchar,
  	"story_image_id" integer,
  	"story_detail_image_id" integer,
  	"story_link_label" varchar DEFAULT 'Read our story',
  	"moments_eyebrow" varchar,
  	"moments_heading" varchar,
  	"moments_intro" varchar,
  	"signature_eyebrow" varchar,
  	"signature_heading" varchar,
  	"signature_intro" varchar,
  	"day_eyebrow" varchar,
  	"day_heading" varchar,
  	"day_intro" varchar,
  	"collage_eyebrow" varchar,
  	"collage_heading" varchar,
  	"collage_intro" varchar,
  	"stories_eyebrow" varchar,
  	"stories_heading" varchar,
  	"destination_eyebrow" varchar,
  	"destination_heading" varchar,
  	"destination_intro" varchar,
  	"destination_image_id" integer,
  	"invitation_eyebrow" varchar,
  	"invitation_heading" varchar,
  	"invitation_intro" varchar,
  	"invitation_image_id" integer,
  	"invitation_button_label" varchar DEFAULT 'Check Availability',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"experiences_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "story_people_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"photo_id" integer,
  	"bio" varchar
  );
  
  CREATE TABLE "story_philosophy_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "story_timeline_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "story_promise_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_intro" varchar,
  	"hero_image_id" integer,
  	"people_heading" varchar,
  	"people_text" varchar,
  	"people_image_id" integer,
  	"philosophy_eyebrow" varchar,
  	"philosophy_heading" varchar,
  	"philosophy_intro" varchar,
  	"local_heading" varchar,
  	"local_text" varchar,
  	"local_image_id" integer,
  	"timeline_heading" varchar,
  	"promise_heading" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "day_moments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"time" "enum_day_moments_time" NOT NULL,
  	"time_label" varchar,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "day" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_eyebrow" varchar,
  	"intro_heading" varchar,
  	"intro_intro" varchar,
  	"closing_heading" varchar,
  	"closing_text" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_contact_next_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stays_eyebrow" varchar,
  	"stays_heading" varchar,
  	"stays_intro" varchar,
  	"stays_image_id" integer,
  	"stays_seo_title" varchar,
  	"stays_seo_description" varchar,
  	"stays_seo_image_id" integer,
  	"stays_seo_noindex" boolean,
  	"experiences_eyebrow" varchar,
  	"experiences_heading" varchar,
  	"experiences_intro" varchar,
  	"experiences_image_id" integer,
  	"experiences_seo_title" varchar,
  	"experiences_seo_description" varchar,
  	"experiences_seo_image_id" integer,
  	"experiences_seo_noindex" boolean,
  	"gallery_eyebrow" varchar,
  	"gallery_heading" varchar,
  	"gallery_intro" varchar,
  	"gallery_image_id" integer,
  	"gallery_postcards_heading" varchar,
  	"gallery_postcards_intro" varchar,
  	"gallery_seo_title" varchar,
  	"gallery_seo_description" varchar,
  	"gallery_seo_image_id" integer,
  	"gallery_seo_noindex" boolean,
  	"journal_eyebrow" varchar,
  	"journal_heading" varchar,
  	"journal_intro" varchar,
  	"journal_image_id" integer,
  	"journal_seo_title" varchar,
  	"journal_seo_description" varchar,
  	"journal_seo_image_id" integer,
  	"journal_seo_noindex" boolean,
  	"faqs_eyebrow" varchar,
  	"faqs_heading" varchar,
  	"faqs_intro" varchar,
  	"faqs_image_id" integer,
  	"faqs_seo_title" varchar,
  	"faqs_seo_description" varchar,
  	"faqs_seo_image_id" integer,
  	"faqs_seo_noindex" boolean,
  	"contact_eyebrow" varchar,
  	"contact_heading" varchar,
  	"contact_intro" varchar,
  	"contact_image_id" integer,
  	"contact_seo_title" varchar,
  	"contact_seo_description" varchar,
  	"contact_seo_image_id" integer,
  	"contact_seo_noindex" boolean,
  	"privacy_eyebrow" varchar,
  	"privacy_heading" varchar,
  	"privacy_intro" varchar,
  	"privacy_image_id" integer,
  	"privacy_body" jsonb,
  	"privacy_seo_title" varchar,
  	"privacy_seo_description" varchar,
  	"privacy_seo_image_id" integer,
  	"privacy_seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "destination_getting_here_routes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mode" "enum_destination_getting_here_routes_mode" NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "destination_seasons_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"months" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "destination_practical_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "destination" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_intro" varchar,
  	"hero_image_id" integer,
  	"getting_here_eyebrow" varchar,
  	"getting_here_heading" varchar,
  	"getting_here_intro" varchar,
  	"explorer_eyebrow" varchar,
  	"explorer_heading" varchar,
  	"explorer_intro" varchar,
  	"seasons_eyebrow" varchar,
  	"seasons_heading" varchar,
  	"seasons_intro" varchar,
  	"practical_heading" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "settings_booking_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_settings_booking_channels_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "settings_policies_house_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rule" varchar NOT NULL
  );
  
  CREATE TABLE "settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT '[BRAND NAME]' NOT NULL,
  	"property_type" varchar DEFAULT '[PROPERTY TYPE]' NOT NULL,
  	"usp" varchar DEFAULT '[PROPERTY USP]',
  	"tagline" varchar,
  	"logo_id" integer,
  	"logo_on_dark_id" integer,
  	"location" varchar DEFAULT '[CITY / REGION]' NOT NULL,
  	"nearby_city" varchar DEFAULT '[NEARBY CITY]',
  	"address_street" varchar,
  	"address_locality" varchar,
  	"address_city" varchar,
  	"address_region" varchar,
  	"address_postal_code" varchar,
  	"address_country" varchar DEFAULT 'India',
  	"geo_latitude" numeric,
  	"geo_longitude" numeric,
  	"maps_url" varchar,
  	"map_embed_url" varchar,
  	"contact_phone" varchar,
  	"contact_whatsapp" varchar,
  	"contact_email" varchar,
  	"contact_response_time" varchar DEFAULT '[RESPONSE TIME]',
  	"contact_hours" varchar,
  	"booking_mode" "enum_settings_booking_mode" DEFAULT 'inquiry' NOT NULL,
  	"booking_engine_url" varchar,
  	"booking_whatsapp_message" varchar DEFAULT 'Hello! I would like to ask about staying at {brand}.',
  	"booking_currency" "enum_settings_booking_currency" DEFAULT 'INR',
  	"booking_payment_note" varchar DEFAULT '[PAYMENT TERMS — e.g. an advance by UPI or bank transfer confirms your booking]',
  	"policies_check_in" varchar DEFAULT '[CHECK-IN TIME]',
  	"policies_check_out" varchar DEFAULT '[CHECK-OUT TIME]',
  	"policies_cancellation" varchar DEFAULT '[CANCELLATION POLICY]',
  	"policies_children" varchar DEFAULT '[CHILD POLICY]',
  	"policies_pets" varchar DEFAULT '[PET POLICY]',
  	"policies_id_requirements" varchar DEFAULT '[ID REQUIREMENTS]',
  	"social_instagram" varchar,
  	"social_facebook" varchar,
  	"social_youtube" varchar,
  	"social_google_business" varchar,
  	"social_tripadvisor" varchar,
  	"seo_is_live" boolean DEFAULT false,
  	"seo_business_type" "enum_settings_seo_business_type" DEFAULT 'LodgingBusiness',
  	"seo_default_description" varchar DEFAULT '{brand} is a {propertyType} in {location} — warm-lit studios with kitchenettes, a courtyard pool and a dining room. Book direct with the hosts.',
  	"seo_share_image_id" integer,
  	"seo_google_verification" varchar,
  	"seo_bing_verification" varchar,
  	"seo_ga4_id" varchar,
  	"seo_vacation_rental" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "stays_highlights" ADD CONSTRAINT "stays_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_moments" ADD CONSTRAINT "stays_moments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_nearby" ADD CONSTRAINT "stays_nearby_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_sleeping" ADD CONSTRAINT "stays_sleeping_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_booking_links" ADD CONSTRAINT "stays_booking_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_house_rules" ADD CONSTRAINT "stays_house_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_faqs" ADD CONSTRAINT "stays_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays" ADD CONSTRAINT "stays_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stays" ADD CONSTRAINT "stays_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stays" ADD CONSTRAINT "stays_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stays_rels" ADD CONSTRAINT "stays_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_rels" ADD CONSTRAINT "stays_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stays_rels" ADD CONSTRAINT "stays_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_highlights" ADD CONSTRAINT "_stays_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_moments" ADD CONSTRAINT "_stays_v_version_moments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_nearby" ADD CONSTRAINT "_stays_v_version_nearby_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_sleeping" ADD CONSTRAINT "_stays_v_version_sleeping_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_booking_links" ADD CONSTRAINT "_stays_v_version_booking_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_house_rules" ADD CONSTRAINT "_stays_v_version_house_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_version_faqs" ADD CONSTRAINT "_stays_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v" ADD CONSTRAINT "_stays_v_parent_id_stays_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stays"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stays_v" ADD CONSTRAINT "_stays_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stays_v" ADD CONSTRAINT "_stays_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stays_v" ADD CONSTRAINT "_stays_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stays_v_rels" ADD CONSTRAINT "_stays_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stays_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_rels" ADD CONSTRAINT "_stays_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stays_v_rels" ADD CONSTRAINT "_stays_v_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_moments" ADD CONSTRAINT "experiences_moments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences" ADD CONSTRAINT "experiences_detail_image_id_media_id_fk" FOREIGN KEY ("detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "experiences_rels" ADD CONSTRAINT "experiences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_rels" ADD CONSTRAINT "experiences_rels_stays_fk" FOREIGN KEY ("stays_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiences_v_version_moments" ADD CONSTRAINT "_experiences_v_version_moments_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_experiences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiences_v" ADD CONSTRAINT "_experiences_v_parent_id_experiences_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."experiences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_v" ADD CONSTRAINT "_experiences_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_v" ADD CONSTRAINT "_experiences_v_version_detail_image_id_media_id_fk" FOREIGN KEY ("version_detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_experiences_v_rels" ADD CONSTRAINT "_experiences_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_experiences_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experiences_v_rels" ADD CONSTRAINT "_experiences_v_rels_stays_fk" FOREIGN KEY ("stays_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal" ADD CONSTRAINT "journal_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal" ADD CONSTRAINT "journal_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_rels" ADD CONSTRAINT "journal_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_rels" ADD CONSTRAINT "journal_rels_stays_fk" FOREIGN KEY ("stays_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_parent_id_journal_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v" ADD CONSTRAINT "_journal_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_v_rels" ADD CONSTRAINT "_journal_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_journal_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_v_rels" ADD CONSTRAINT "_journal_v_rels_stays_fk" FOREIGN KEY ("stays_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "places" ADD CONSTRAINT "places_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stays_fk" FOREIGN KEY ("stays_id") REFERENCES "public"."stays"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journal"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inquiries_fk" FOREIGN KEY ("inquiries_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_story_lines" ADD CONSTRAINT "home_story_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_moments_items_highlights" ADD CONSTRAINT "home_moments_items_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_moments_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_moments_items" ADD CONSTRAINT "home_moments_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_moments_items" ADD CONSTRAINT "home_moments_items_stay_id_stays_id_fk" FOREIGN KEY ("stay_id") REFERENCES "public"."stays"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_moments_items" ADD CONSTRAINT "home_moments_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_mobile_image_id_media_id_fk" FOREIGN KEY ("hero_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_story_image_id_media_id_fk" FOREIGN KEY ("story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_story_detail_image_id_media_id_fk" FOREIGN KEY ("story_detail_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_destination_image_id_media_id_fk" FOREIGN KEY ("destination_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_invitation_image_id_media_id_fk" FOREIGN KEY ("invitation_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_people_members" ADD CONSTRAINT "story_people_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story_people_members" ADD CONSTRAINT "story_people_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_philosophy_pillars" ADD CONSTRAINT "story_philosophy_pillars_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story_philosophy_pillars" ADD CONSTRAINT "story_philosophy_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_timeline_entries" ADD CONSTRAINT "story_timeline_entries_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story_timeline_entries" ADD CONSTRAINT "story_timeline_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_promise_items" ADD CONSTRAINT "story_promise_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story" ADD CONSTRAINT "story_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story" ADD CONSTRAINT "story_people_image_id_media_id_fk" FOREIGN KEY ("people_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story" ADD CONSTRAINT "story_local_image_id_media_id_fk" FOREIGN KEY ("local_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story" ADD CONSTRAINT "story_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "day_moments" ADD CONSTRAINT "day_moments_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "day_moments" ADD CONSTRAINT "day_moments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."day"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "day" ADD CONSTRAINT "day_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_contact_next_steps" ADD CONSTRAINT "pages_contact_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_stays_image_id_media_id_fk" FOREIGN KEY ("stays_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_stays_seo_image_id_media_id_fk" FOREIGN KEY ("stays_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_experiences_image_id_media_id_fk" FOREIGN KEY ("experiences_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_experiences_seo_image_id_media_id_fk" FOREIGN KEY ("experiences_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_gallery_image_id_media_id_fk" FOREIGN KEY ("gallery_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_gallery_seo_image_id_media_id_fk" FOREIGN KEY ("gallery_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_journal_image_id_media_id_fk" FOREIGN KEY ("journal_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_journal_seo_image_id_media_id_fk" FOREIGN KEY ("journal_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_faqs_image_id_media_id_fk" FOREIGN KEY ("faqs_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_faqs_seo_image_id_media_id_fk" FOREIGN KEY ("faqs_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_contact_image_id_media_id_fk" FOREIGN KEY ("contact_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_contact_seo_image_id_media_id_fk" FOREIGN KEY ("contact_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_privacy_image_id_media_id_fk" FOREIGN KEY ("privacy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_privacy_seo_image_id_media_id_fk" FOREIGN KEY ("privacy_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destination_getting_here_routes" ADD CONSTRAINT "destination_getting_here_routes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_seasons_items" ADD CONSTRAINT "destination_seasons_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_practical_items" ADD CONSTRAINT "destination_practical_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination" ADD CONSTRAINT "destination_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destination" ADD CONSTRAINT "destination_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings_booking_channels" ADD CONSTRAINT "settings_booking_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_policies_house_rules" ADD CONSTRAINT "settings_policies_house_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_seo_share_image_id_media_id_fk" FOREIGN KEY ("seo_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "stays_highlights_order_idx" ON "stays_highlights" USING btree ("_order");
  CREATE INDEX "stays_highlights_parent_id_idx" ON "stays_highlights" USING btree ("_parent_id");
  CREATE INDEX "stays_moments_order_idx" ON "stays_moments" USING btree ("order");
  CREATE INDEX "stays_moments_parent_idx" ON "stays_moments" USING btree ("parent_id");
  CREATE INDEX "stays_nearby_order_idx" ON "stays_nearby" USING btree ("_order");
  CREATE INDEX "stays_nearby_parent_id_idx" ON "stays_nearby" USING btree ("_parent_id");
  CREATE INDEX "stays_sleeping_order_idx" ON "stays_sleeping" USING btree ("_order");
  CREATE INDEX "stays_sleeping_parent_id_idx" ON "stays_sleeping" USING btree ("_parent_id");
  CREATE INDEX "stays_booking_links_order_idx" ON "stays_booking_links" USING btree ("_order");
  CREATE INDEX "stays_booking_links_parent_id_idx" ON "stays_booking_links" USING btree ("_parent_id");
  CREATE INDEX "stays_house_rules_order_idx" ON "stays_house_rules" USING btree ("_order");
  CREATE INDEX "stays_house_rules_parent_id_idx" ON "stays_house_rules" USING btree ("_parent_id");
  CREATE INDEX "stays_faqs_order_idx" ON "stays_faqs" USING btree ("_order");
  CREATE INDEX "stays_faqs_parent_id_idx" ON "stays_faqs" USING btree ("_parent_id");
  CREATE INDEX "stays__order_idx" ON "stays" USING btree ("_order");
  CREATE UNIQUE INDEX "stays_slug_idx" ON "stays" USING btree ("slug");
  CREATE INDEX "stays_hero_image_idx" ON "stays" USING btree ("hero_image_id");
  CREATE INDEX "stays_video_idx" ON "stays" USING btree ("video_id");
  CREATE INDEX "stays_seo_seo_image_idx" ON "stays" USING btree ("seo_image_id");
  CREATE INDEX "stays_updated_at_idx" ON "stays" USING btree ("updated_at");
  CREATE INDEX "stays_created_at_idx" ON "stays" USING btree ("created_at");
  CREATE INDEX "stays__status_idx" ON "stays" USING btree ("_status");
  CREATE INDEX "stays_rels_order_idx" ON "stays_rels" USING btree ("order");
  CREATE INDEX "stays_rels_parent_idx" ON "stays_rels" USING btree ("parent_id");
  CREATE INDEX "stays_rels_path_idx" ON "stays_rels" USING btree ("path");
  CREATE INDEX "stays_rels_media_id_idx" ON "stays_rels" USING btree ("media_id");
  CREATE INDEX "stays_rels_amenities_id_idx" ON "stays_rels" USING btree ("amenities_id");
  CREATE INDEX "_stays_v_version_highlights_order_idx" ON "_stays_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_stays_v_version_highlights_parent_id_idx" ON "_stays_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_moments_order_idx" ON "_stays_v_version_moments" USING btree ("order");
  CREATE INDEX "_stays_v_version_moments_parent_idx" ON "_stays_v_version_moments" USING btree ("parent_id");
  CREATE INDEX "_stays_v_version_nearby_order_idx" ON "_stays_v_version_nearby" USING btree ("_order");
  CREATE INDEX "_stays_v_version_nearby_parent_id_idx" ON "_stays_v_version_nearby" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_sleeping_order_idx" ON "_stays_v_version_sleeping" USING btree ("_order");
  CREATE INDEX "_stays_v_version_sleeping_parent_id_idx" ON "_stays_v_version_sleeping" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_booking_links_order_idx" ON "_stays_v_version_booking_links" USING btree ("_order");
  CREATE INDEX "_stays_v_version_booking_links_parent_id_idx" ON "_stays_v_version_booking_links" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_house_rules_order_idx" ON "_stays_v_version_house_rules" USING btree ("_order");
  CREATE INDEX "_stays_v_version_house_rules_parent_id_idx" ON "_stays_v_version_house_rules" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_version_faqs_order_idx" ON "_stays_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_stays_v_version_faqs_parent_id_idx" ON "_stays_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_stays_v_parent_idx" ON "_stays_v" USING btree ("parent_id");
  CREATE INDEX "_stays_v_version_version__order_idx" ON "_stays_v" USING btree ("version__order");
  CREATE INDEX "_stays_v_version_version_slug_idx" ON "_stays_v" USING btree ("version_slug");
  CREATE INDEX "_stays_v_version_version_hero_image_idx" ON "_stays_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_stays_v_version_version_video_idx" ON "_stays_v" USING btree ("version_video_id");
  CREATE INDEX "_stays_v_version_seo_version_seo_image_idx" ON "_stays_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_stays_v_version_version_updated_at_idx" ON "_stays_v" USING btree ("version_updated_at");
  CREATE INDEX "_stays_v_version_version_created_at_idx" ON "_stays_v" USING btree ("version_created_at");
  CREATE INDEX "_stays_v_version_version__status_idx" ON "_stays_v" USING btree ("version__status");
  CREATE INDEX "_stays_v_created_at_idx" ON "_stays_v" USING btree ("created_at");
  CREATE INDEX "_stays_v_updated_at_idx" ON "_stays_v" USING btree ("updated_at");
  CREATE INDEX "_stays_v_latest_idx" ON "_stays_v" USING btree ("latest");
  CREATE INDEX "_stays_v_rels_order_idx" ON "_stays_v_rels" USING btree ("order");
  CREATE INDEX "_stays_v_rels_parent_idx" ON "_stays_v_rels" USING btree ("parent_id");
  CREATE INDEX "_stays_v_rels_path_idx" ON "_stays_v_rels" USING btree ("path");
  CREATE INDEX "_stays_v_rels_media_id_idx" ON "_stays_v_rels" USING btree ("media_id");
  CREATE INDEX "_stays_v_rels_amenities_id_idx" ON "_stays_v_rels" USING btree ("amenities_id");
  CREATE INDEX "amenities__order_idx" ON "amenities" USING btree ("_order");
  CREATE INDEX "amenities_updated_at_idx" ON "amenities" USING btree ("updated_at");
  CREATE INDEX "amenities_created_at_idx" ON "amenities" USING btree ("created_at");
  CREATE INDEX "experiences_moments_order_idx" ON "experiences_moments" USING btree ("order");
  CREATE INDEX "experiences_moments_parent_idx" ON "experiences_moments" USING btree ("parent_id");
  CREATE INDEX "experiences__order_idx" ON "experiences" USING btree ("_order");
  CREATE UNIQUE INDEX "experiences_slug_idx" ON "experiences" USING btree ("slug");
  CREATE INDEX "experiences_image_idx" ON "experiences" USING btree ("image_id");
  CREATE INDEX "experiences_detail_image_idx" ON "experiences" USING btree ("detail_image_id");
  CREATE INDEX "experiences_updated_at_idx" ON "experiences" USING btree ("updated_at");
  CREATE INDEX "experiences_created_at_idx" ON "experiences" USING btree ("created_at");
  CREATE INDEX "experiences__status_idx" ON "experiences" USING btree ("_status");
  CREATE INDEX "experiences_rels_order_idx" ON "experiences_rels" USING btree ("order");
  CREATE INDEX "experiences_rels_parent_idx" ON "experiences_rels" USING btree ("parent_id");
  CREATE INDEX "experiences_rels_path_idx" ON "experiences_rels" USING btree ("path");
  CREATE INDEX "experiences_rels_stays_id_idx" ON "experiences_rels" USING btree ("stays_id");
  CREATE INDEX "_experiences_v_version_moments_order_idx" ON "_experiences_v_version_moments" USING btree ("order");
  CREATE INDEX "_experiences_v_version_moments_parent_idx" ON "_experiences_v_version_moments" USING btree ("parent_id");
  CREATE INDEX "_experiences_v_parent_idx" ON "_experiences_v" USING btree ("parent_id");
  CREATE INDEX "_experiences_v_version_version__order_idx" ON "_experiences_v" USING btree ("version__order");
  CREATE INDEX "_experiences_v_version_version_slug_idx" ON "_experiences_v" USING btree ("version_slug");
  CREATE INDEX "_experiences_v_version_version_image_idx" ON "_experiences_v" USING btree ("version_image_id");
  CREATE INDEX "_experiences_v_version_version_detail_image_idx" ON "_experiences_v" USING btree ("version_detail_image_id");
  CREATE INDEX "_experiences_v_version_version_updated_at_idx" ON "_experiences_v" USING btree ("version_updated_at");
  CREATE INDEX "_experiences_v_version_version_created_at_idx" ON "_experiences_v" USING btree ("version_created_at");
  CREATE INDEX "_experiences_v_version_version__status_idx" ON "_experiences_v" USING btree ("version__status");
  CREATE INDEX "_experiences_v_created_at_idx" ON "_experiences_v" USING btree ("created_at");
  CREATE INDEX "_experiences_v_updated_at_idx" ON "_experiences_v" USING btree ("updated_at");
  CREATE INDEX "_experiences_v_latest_idx" ON "_experiences_v" USING btree ("latest");
  CREATE INDEX "_experiences_v_rels_order_idx" ON "_experiences_v_rels" USING btree ("order");
  CREATE INDEX "_experiences_v_rels_parent_idx" ON "_experiences_v_rels" USING btree ("parent_id");
  CREATE INDEX "_experiences_v_rels_path_idx" ON "_experiences_v_rels" USING btree ("path");
  CREATE INDEX "_experiences_v_rels_stays_id_idx" ON "_experiences_v_rels" USING btree ("stays_id");
  CREATE UNIQUE INDEX "journal_slug_idx" ON "journal" USING btree ("slug");
  CREATE INDEX "journal_cover_image_idx" ON "journal" USING btree ("cover_image_id");
  CREATE INDEX "journal_seo_seo_image_idx" ON "journal" USING btree ("seo_image_id");
  CREATE INDEX "journal_updated_at_idx" ON "journal" USING btree ("updated_at");
  CREATE INDEX "journal_created_at_idx" ON "journal" USING btree ("created_at");
  CREATE INDEX "journal__status_idx" ON "journal" USING btree ("_status");
  CREATE INDEX "journal_rels_order_idx" ON "journal_rels" USING btree ("order");
  CREATE INDEX "journal_rels_parent_idx" ON "journal_rels" USING btree ("parent_id");
  CREATE INDEX "journal_rels_path_idx" ON "journal_rels" USING btree ("path");
  CREATE INDEX "journal_rels_stays_id_idx" ON "journal_rels" USING btree ("stays_id");
  CREATE INDEX "_journal_v_parent_idx" ON "_journal_v" USING btree ("parent_id");
  CREATE INDEX "_journal_v_version_version_slug_idx" ON "_journal_v" USING btree ("version_slug");
  CREATE INDEX "_journal_v_version_version_cover_image_idx" ON "_journal_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_journal_v_version_seo_version_seo_image_idx" ON "_journal_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_journal_v_version_version_updated_at_idx" ON "_journal_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_v_version_version_created_at_idx" ON "_journal_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_v_version_version__status_idx" ON "_journal_v" USING btree ("version__status");
  CREATE INDEX "_journal_v_created_at_idx" ON "_journal_v" USING btree ("created_at");
  CREATE INDEX "_journal_v_updated_at_idx" ON "_journal_v" USING btree ("updated_at");
  CREATE INDEX "_journal_v_latest_idx" ON "_journal_v" USING btree ("latest");
  CREATE INDEX "_journal_v_rels_order_idx" ON "_journal_v_rels" USING btree ("order");
  CREATE INDEX "_journal_v_rels_parent_idx" ON "_journal_v_rels" USING btree ("parent_id");
  CREATE INDEX "_journal_v_rels_path_idx" ON "_journal_v_rels" USING btree ("path");
  CREATE INDEX "_journal_v_rels_stays_id_idx" ON "_journal_v_rels" USING btree ("stays_id");
  CREATE INDEX "testimonials__order_idx" ON "testimonials" USING btree ("_order");
  CREATE INDEX "testimonials_stay_idx" ON "testimonials" USING btree ("stay_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faqs__order_idx" ON "faqs" USING btree ("_order");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "places__order_idx" ON "places" USING btree ("_order");
  CREATE INDEX "places_image_idx" ON "places" USING btree ("image_id");
  CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");
  CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");
  CREATE INDEX "inquiries_stay_idx" ON "inquiries" USING btree ("stay_id");
  CREATE INDEX "inquiries_updated_at_idx" ON "inquiries" USING btree ("updated_at");
  CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");
  CREATE INDEX "media__order_idx" ON "media" USING btree ("_order");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_stays_id_idx" ON "payload_locked_documents_rels" USING btree ("stays_id");
  CREATE INDEX "payload_locked_documents_rels_amenities_id_idx" ON "payload_locked_documents_rels" USING btree ("amenities_id");
  CREATE INDEX "payload_locked_documents_rels_experiences_id_idx" ON "payload_locked_documents_rels" USING btree ("experiences_id");
  CREATE INDEX "payload_locked_documents_rels_journal_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_places_id_idx" ON "payload_locked_documents_rels" USING btree ("places_id");
  CREATE INDEX "payload_locked_documents_rels_inquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("inquiries_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_story_lines_order_idx" ON "home_story_lines" USING btree ("_order");
  CREATE INDEX "home_story_lines_parent_id_idx" ON "home_story_lines" USING btree ("_parent_id");
  CREATE INDEX "home_moments_items_highlights_order_idx" ON "home_moments_items_highlights" USING btree ("_order");
  CREATE INDEX "home_moments_items_highlights_parent_id_idx" ON "home_moments_items_highlights" USING btree ("_parent_id");
  CREATE INDEX "home_moments_items_order_idx" ON "home_moments_items" USING btree ("_order");
  CREATE INDEX "home_moments_items_parent_id_idx" ON "home_moments_items" USING btree ("_parent_id");
  CREATE INDEX "home_moments_items_image_idx" ON "home_moments_items" USING btree ("image_id");
  CREATE INDEX "home_moments_items_stay_idx" ON "home_moments_items" USING btree ("stay_id");
  CREATE INDEX "home_hero_hero_image_idx" ON "home" USING btree ("hero_image_id");
  CREATE INDEX "home_hero_hero_mobile_image_idx" ON "home" USING btree ("hero_mobile_image_id");
  CREATE INDEX "home_hero_hero_video_idx" ON "home" USING btree ("hero_video_id");
  CREATE INDEX "home_story_story_image_idx" ON "home" USING btree ("story_image_id");
  CREATE INDEX "home_story_story_detail_image_idx" ON "home" USING btree ("story_detail_image_id");
  CREATE INDEX "home_destination_destination_image_idx" ON "home" USING btree ("destination_image_id");
  CREATE INDEX "home_invitation_invitation_image_idx" ON "home" USING btree ("invitation_image_id");
  CREATE INDEX "home_seo_seo_image_idx" ON "home" USING btree ("seo_image_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_experiences_id_idx" ON "home_rels" USING btree ("experiences_id");
  CREATE INDEX "home_rels_media_id_idx" ON "home_rels" USING btree ("media_id");
  CREATE INDEX "story_people_members_order_idx" ON "story_people_members" USING btree ("_order");
  CREATE INDEX "story_people_members_parent_id_idx" ON "story_people_members" USING btree ("_parent_id");
  CREATE INDEX "story_people_members_photo_idx" ON "story_people_members" USING btree ("photo_id");
  CREATE INDEX "story_philosophy_pillars_order_idx" ON "story_philosophy_pillars" USING btree ("_order");
  CREATE INDEX "story_philosophy_pillars_parent_id_idx" ON "story_philosophy_pillars" USING btree ("_parent_id");
  CREATE INDEX "story_philosophy_pillars_image_idx" ON "story_philosophy_pillars" USING btree ("image_id");
  CREATE INDEX "story_timeline_entries_order_idx" ON "story_timeline_entries" USING btree ("_order");
  CREATE INDEX "story_timeline_entries_parent_id_idx" ON "story_timeline_entries" USING btree ("_parent_id");
  CREATE INDEX "story_timeline_entries_image_idx" ON "story_timeline_entries" USING btree ("image_id");
  CREATE INDEX "story_promise_items_order_idx" ON "story_promise_items" USING btree ("_order");
  CREATE INDEX "story_promise_items_parent_id_idx" ON "story_promise_items" USING btree ("_parent_id");
  CREATE INDEX "story_hero_hero_image_idx" ON "story" USING btree ("hero_image_id");
  CREATE INDEX "story_people_people_image_idx" ON "story" USING btree ("people_image_id");
  CREATE INDEX "story_local_local_image_idx" ON "story" USING btree ("local_image_id");
  CREATE INDEX "story_seo_seo_image_idx" ON "story" USING btree ("seo_image_id");
  CREATE INDEX "day_moments_order_idx" ON "day_moments" USING btree ("_order");
  CREATE INDEX "day_moments_parent_id_idx" ON "day_moments" USING btree ("_parent_id");
  CREATE INDEX "day_moments_image_idx" ON "day_moments" USING btree ("image_id");
  CREATE INDEX "day_seo_seo_image_idx" ON "day" USING btree ("seo_image_id");
  CREATE INDEX "pages_contact_next_steps_order_idx" ON "pages_contact_next_steps" USING btree ("_order");
  CREATE INDEX "pages_contact_next_steps_parent_id_idx" ON "pages_contact_next_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_stays_stays_image_idx" ON "pages" USING btree ("stays_image_id");
  CREATE INDEX "pages_stays_seo_stays_seo_image_idx" ON "pages" USING btree ("stays_seo_image_id");
  CREATE INDEX "pages_experiences_experiences_image_idx" ON "pages" USING btree ("experiences_image_id");
  CREATE INDEX "pages_experiences_seo_experiences_seo_image_idx" ON "pages" USING btree ("experiences_seo_image_id");
  CREATE INDEX "pages_gallery_gallery_image_idx" ON "pages" USING btree ("gallery_image_id");
  CREATE INDEX "pages_gallery_seo_gallery_seo_image_idx" ON "pages" USING btree ("gallery_seo_image_id");
  CREATE INDEX "pages_journal_journal_image_idx" ON "pages" USING btree ("journal_image_id");
  CREATE INDEX "pages_journal_seo_journal_seo_image_idx" ON "pages" USING btree ("journal_seo_image_id");
  CREATE INDEX "pages_faqs_faqs_image_idx" ON "pages" USING btree ("faqs_image_id");
  CREATE INDEX "pages_faqs_seo_faqs_seo_image_idx" ON "pages" USING btree ("faqs_seo_image_id");
  CREATE INDEX "pages_contact_contact_image_idx" ON "pages" USING btree ("contact_image_id");
  CREATE INDEX "pages_contact_seo_contact_seo_image_idx" ON "pages" USING btree ("contact_seo_image_id");
  CREATE INDEX "pages_privacy_privacy_image_idx" ON "pages" USING btree ("privacy_image_id");
  CREATE INDEX "pages_privacy_seo_privacy_seo_image_idx" ON "pages" USING btree ("privacy_seo_image_id");
  CREATE INDEX "destination_getting_here_routes_order_idx" ON "destination_getting_here_routes" USING btree ("_order");
  CREATE INDEX "destination_getting_here_routes_parent_id_idx" ON "destination_getting_here_routes" USING btree ("_parent_id");
  CREATE INDEX "destination_seasons_items_order_idx" ON "destination_seasons_items" USING btree ("_order");
  CREATE INDEX "destination_seasons_items_parent_id_idx" ON "destination_seasons_items" USING btree ("_parent_id");
  CREATE INDEX "destination_practical_items_order_idx" ON "destination_practical_items" USING btree ("_order");
  CREATE INDEX "destination_practical_items_parent_id_idx" ON "destination_practical_items" USING btree ("_parent_id");
  CREATE INDEX "destination_hero_hero_image_idx" ON "destination" USING btree ("hero_image_id");
  CREATE INDEX "destination_seo_seo_image_idx" ON "destination" USING btree ("seo_image_id");
  CREATE INDEX "settings_booking_channels_order_idx" ON "settings_booking_channels" USING btree ("_order");
  CREATE INDEX "settings_booking_channels_parent_id_idx" ON "settings_booking_channels" USING btree ("_parent_id");
  CREATE INDEX "settings_policies_house_rules_order_idx" ON "settings_policies_house_rules" USING btree ("_order");
  CREATE INDEX "settings_policies_house_rules_parent_id_idx" ON "settings_policies_house_rules" USING btree ("_parent_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE INDEX "settings_logo_on_dark_idx" ON "settings" USING btree ("logo_on_dark_id");
  CREATE INDEX "settings_seo_seo_share_image_idx" ON "settings" USING btree ("seo_share_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "stays_highlights" CASCADE;
  DROP TABLE "stays_moments" CASCADE;
  DROP TABLE "stays_nearby" CASCADE;
  DROP TABLE "stays_sleeping" CASCADE;
  DROP TABLE "stays_booking_links" CASCADE;
  DROP TABLE "stays_house_rules" CASCADE;
  DROP TABLE "stays_faqs" CASCADE;
  DROP TABLE "stays" CASCADE;
  DROP TABLE "stays_rels" CASCADE;
  DROP TABLE "_stays_v_version_highlights" CASCADE;
  DROP TABLE "_stays_v_version_moments" CASCADE;
  DROP TABLE "_stays_v_version_nearby" CASCADE;
  DROP TABLE "_stays_v_version_sleeping" CASCADE;
  DROP TABLE "_stays_v_version_booking_links" CASCADE;
  DROP TABLE "_stays_v_version_house_rules" CASCADE;
  DROP TABLE "_stays_v_version_faqs" CASCADE;
  DROP TABLE "_stays_v" CASCADE;
  DROP TABLE "_stays_v_rels" CASCADE;
  DROP TABLE "amenities" CASCADE;
  DROP TABLE "experiences_moments" CASCADE;
  DROP TABLE "experiences" CASCADE;
  DROP TABLE "experiences_rels" CASCADE;
  DROP TABLE "_experiences_v_version_moments" CASCADE;
  DROP TABLE "_experiences_v" CASCADE;
  DROP TABLE "_experiences_v_rels" CASCADE;
  DROP TABLE "journal" CASCADE;
  DROP TABLE "journal_rels" CASCADE;
  DROP TABLE "_journal_v" CASCADE;
  DROP TABLE "_journal_v_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "places" CASCADE;
  DROP TABLE "inquiries" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_story_lines" CASCADE;
  DROP TABLE "home_moments_items_highlights" CASCADE;
  DROP TABLE "home_moments_items" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "story_people_members" CASCADE;
  DROP TABLE "story_philosophy_pillars" CASCADE;
  DROP TABLE "story_timeline_entries" CASCADE;
  DROP TABLE "story_promise_items" CASCADE;
  DROP TABLE "story" CASCADE;
  DROP TABLE "day_moments" CASCADE;
  DROP TABLE "day" CASCADE;
  DROP TABLE "pages_contact_next_steps" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "destination_getting_here_routes" CASCADE;
  DROP TABLE "destination_seasons_items" CASCADE;
  DROP TABLE "destination_practical_items" CASCADE;
  DROP TABLE "destination" CASCADE;
  DROP TABLE "settings_booking_channels" CASCADE;
  DROP TABLE "settings_policies_house_rules" CASCADE;
  DROP TABLE "settings" CASCADE;
  DROP TYPE "public"."enum_stays_moments";
  DROP TYPE "public"."enum_stays_booking_links_platform";
  DROP TYPE "public"."enum_stays_stay_type";
  DROP TYPE "public"."enum_stays_size_unit";
  DROP TYPE "public"."enum_stays_price_unit";
  DROP TYPE "public"."enum_stays_rating_platform";
  DROP TYPE "public"."enum_stays_status";
  DROP TYPE "public"."enum__stays_v_version_moments";
  DROP TYPE "public"."enum__stays_v_version_booking_links_platform";
  DROP TYPE "public"."enum__stays_v_version_stay_type";
  DROP TYPE "public"."enum__stays_v_version_size_unit";
  DROP TYPE "public"."enum__stays_v_version_price_unit";
  DROP TYPE "public"."enum__stays_v_version_rating_platform";
  DROP TYPE "public"."enum__stays_v_version_status";
  DROP TYPE "public"."enum_amenities_category";
  DROP TYPE "public"."enum_amenities_icon";
  DROP TYPE "public"."enum_experiences_moments";
  DROP TYPE "public"."enum_experiences_kind";
  DROP TYPE "public"."enum_experiences_status";
  DROP TYPE "public"."enum__experiences_v_version_moments";
  DROP TYPE "public"."enum__experiences_v_version_kind";
  DROP TYPE "public"."enum__experiences_v_version_status";
  DROP TYPE "public"."enum_journal_category";
  DROP TYPE "public"."enum_journal_status";
  DROP TYPE "public"."enum__journal_v_version_category";
  DROP TYPE "public"."enum__journal_v_version_status";
  DROP TYPE "public"."enum_testimonials_source";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_places_category";
  DROP TYPE "public"."enum_places_direction";
  DROP TYPE "public"."enum_places_mode";
  DROP TYPE "public"."enum_inquiries_status";
  DROP TYPE "public"."enum_inquiries_preferred_contact";
  DROP TYPE "public"."enum_media_category";
  DROP TYPE "public"."enum_day_moments_time";
  DROP TYPE "public"."enum_destination_getting_here_routes_mode";
  DROP TYPE "public"."enum_settings_booking_channels_platform";
  DROP TYPE "public"."enum_settings_booking_mode";
  DROP TYPE "public"."enum_settings_booking_currency";
  DROP TYPE "public"."enum_settings_seo_business_type";`)
}
