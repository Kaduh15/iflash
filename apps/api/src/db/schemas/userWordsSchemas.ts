import { sql } from "drizzle-orm";
import {
	check,
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

import { users } from "./userSchema.ts";
import { words } from "./words.ts";

export const resultSchema = pgEnum("result", ["fail", "hard", "good", "easy"]);
export const statusSchema = pgEnum("status", [
	"locked",
	"unlocked",
	"learning",
	"done",
]);

export const userWords = pgTable(
	"user_words",
	{
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		wordId: uuid("word_id")
			.references(() => words.id, { onDelete: "cascade" })
			.notNull(),
		status: statusSchema("status").default("locked"),
		nextReviewDate: date("next_review_date"),
		ease: integer("ease"),
		lapses: integer("lapses").default(0).notNull(),
		seenCount: integer("seen_count").default(0).notNull(),
		lastResult: resultSchema("last_result").notNull(),
		lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
	},
	(table) => [
		check("ease_check", sql`${table.ease} >= 1 AND ${table.ease} <= 3`),
		index("idx_user_words_user_id").on(table.userId),
		index("idx_user_words_next_review_date").on(table.nextReviewDate),
		index("idx_user_words_status").on(table.status),
	]
);
