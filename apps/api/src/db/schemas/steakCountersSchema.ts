import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { users } from "./userSchema.ts";

export const steakCounters = pgTable(
	"steak_counters",
	{
		userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
		currentSteakDays: integer("current_steak_days").default(0).notNull(),
		bestSteackDays: integer("best_steak_days").default(0).notNull(),
		lastStudyDate: integer("last_study_date").notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId] })]
);
