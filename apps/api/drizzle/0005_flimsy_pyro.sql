ALTER TABLE "steak_counters" DROP COLUMN "id";
ALTER TABLE "steak_counters" ADD CONSTRAINT "steak_counters_user_id_pk" PRIMARY KEY("user_id");--> statement-breakpoint