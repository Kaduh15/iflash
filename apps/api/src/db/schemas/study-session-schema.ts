import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { v7 as uuidv7 } from "uuid"
import { User } from "./user-schema.ts"

export const StudySession = pgTable("study_sessions", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	userId: uuid("user_id")
		.references(() => User.id, { onDelete: "cascade" })
		.notNull(),
	startedAt: timestamp("started_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	cardsTotalPlanned: integer("cards_total_planned").notNull(),
	cardsCompleted: integer("cards_completed").default(0).notNull(),
	source: text("source").$type<"daily_review" | "learning_session">().notNull(),
})
