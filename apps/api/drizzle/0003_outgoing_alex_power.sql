ALTER TABLE "steak_counters" DROP CONSTRAINT "steak_counters_user_id_pk";--> statement-breakpoint
ALTER TABLE "steak_counters" ADD COLUMN "id" uuid PRIMARY KEY NOT NULL;