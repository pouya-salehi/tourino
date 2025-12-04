CREATE TYPE "public"."verify_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "tour_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tours" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_documents" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_completed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "national_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "license_number" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verify_status" "verify_status" DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "rejected_reason" text;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "verify_status" "verify_status" DEFAULT 'PENDING';--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "admin_note" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "verification_documents" DROP COLUMN "status";