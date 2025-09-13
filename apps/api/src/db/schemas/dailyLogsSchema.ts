import { date, integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema.ts";

export const dailyLogs = pgTable(
	"daily_logs",
	{
		userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
		date: date("date"),
		unlockedCount: integer("unlocked_count").default(0).notNull(),
		studiedCount: integer("studied_count").default(0).notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.date] })]
);
