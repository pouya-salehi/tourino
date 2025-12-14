CREATE TYPE "public"."modal_animation" AS ENUM('fade', 'slide-up', 'slide-down', 'zoom-in');--> statement-breakpoint
CREATE TYPE "public"."modal_background" AS ENUM('solid', 'gradient', 'image');--> statement-breakpoint
CREATE TABLE "modals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"coupon_percentage" integer DEFAULT 0,
	"expires_at" timestamp NOT NULL,
	"background_type" "modal_background" DEFAULT 'solid',
	"background_value" text NOT NULL,
	"animation" "modal_animation" DEFAULT 'fade',
	"owner_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "modals" ADD CONSTRAINT "modals_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;