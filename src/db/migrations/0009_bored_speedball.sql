ALTER TABLE "verification_documents" DROP CONSTRAINT "verification_documents_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "additional_docs" text[];--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "signed_contract" text;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "reviewed_at" timestamp;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "reviewed_by" integer;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "request_number" text;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "version" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_request_number_unique" UNIQUE("request_number");