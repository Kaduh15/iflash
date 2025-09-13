import { date, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core"
import { User } from "./user-schema.ts"

export const DailyLog = pgTable(
	"daily_logs",
	{
		userId: uuid("user_id").references(() => User.id, { onDelete: "cascade" }),
		date: date("date"),
		unlockedCount: integer("unlocked_count").default(0).notNull(),
		studiedCount: integer("studied_count").default(0).notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.date] })]
)
