import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core"
import { v7 as uuidv7 } from "uuid"

export const Word = pgTable("words", {
	id: uuid("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	english: text("english").notNull(),
	portuguese: text("portuguese").notNull(),
	exampleEn: text("example_en"),
	examplePt: text("example_pt"),
	isActive: boolean("is_active").default(true).notNull(),
})
