import { date, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

import { studySessions } from "./studySessionsSchema.ts";
import { users } from "./userSchema.ts";
import { resultSchema } from "./userWordsSchemas.ts";
import { words } from "./words.ts";

export const reviewEvents = pgTable("review_events", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	sessionId: uuid("session_id")
		.references(() => studySessions.id, { onDelete: "cascade" })
		.notNull(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	wordId: uuid("word_id")
		.references(() => words.id, { onDelete: "cascade" })
		.notNull(),
	result: resultSchema("result").notNull(),
	scheduleNextReviewDate: date("schedule_next_review_date").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});
