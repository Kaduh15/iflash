CREATE TYPE "public"."result" AS ENUM('fail', 'hard', 'good', 'easy');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('locked', 'unlocked', 'learning', 'done');--> statement-breakpoint
CREATE TABLE "daily_logs" (
	"user_id" uuid,
	"date" date,
	"unlocked_count" integer DEFAULT 0 NOT NULL,
	"studied_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "daily_logs_user_id_date_pk" PRIMARY KEY("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "review_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"result" "result" NOT NULL,
	"schedule_next_review_date" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "steak_counters" (
	"user_id" uuid,
	"current_steak_days" integer DEFAULT 0 NOT NULL,
	"best_steak_days" integer DEFAULT 0 NOT NULL,
	"last_study_date" integer NOT NULL,
	CONSTRAINT "steak_counters_user_id_pk" PRIMARY KEY("user_id")
);
--> statement-breakpoint
CREATE TABLE "study_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"cards_total_planned" integer NOT NULL,
	"cards_completed" integer DEFAULT 0 NOT NULL,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_words" (
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"status" "status" DEFAULT 'locked',
	"next_review_date" date,
	"ease" integer,
	"lapses" integer DEFAULT 0 NOT NULL,
	"seen_count" integer DEFAULT 0 NOT NULL,
	"last_result" "result" NOT NULL,
	"last_seen_at" timestamp with time zone,
	CONSTRAINT "ease_check" CHECK ("user_words"."ease" >= 1 AND "user_words"."ease" <= 3)
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY NOT NULL,
	"english" text NOT NULL,
	"portuguese" text NOT NULL,
	"example_en" text,
	"example_pt" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_events" ADD CONSTRAINT "review_events_session_id_study_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."study_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_events" ADD CONSTRAINT "review_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_events" ADD CONSTRAINT "review_events_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "steak_counters" ADD CONSTRAINT "steak_counters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "study_sessions" ADD CONSTRAINT "study_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_words_user_id" ON "user_words" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_words_next_review_date" ON "user_words" USING btree ("next_review_date");--> statement-breakpoint
CREATE INDEX "idx_user_words_status" ON "user_words" USING btree ("status");