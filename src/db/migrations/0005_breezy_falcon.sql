ALTER TABLE "tours" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "features" text DEFAULT ;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "includes" text DEFAULT ;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "excludes" text DEFAULT ;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "schedule" text DEFAULT ;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "faqs" text DEFAULT ;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "enable_comments" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "show_likes" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "show_rating" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "meta_title" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "tours" ADD COLUMN "meta_keywords" text DEFAULT ;