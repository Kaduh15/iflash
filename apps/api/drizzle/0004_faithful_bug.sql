ALTER TABLE "daily_logs" DROP CONSTRAINT "daily_logs_user_id_date_pk";--> statement-breakpoint
ALTER TABLE "daily_logs" ALTER COLUMN "date" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "daily_logs" ALTER COLUMN "date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD COLUMN "id" uuid PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_user_id_date_unique" UNIQUE("user_id","date");