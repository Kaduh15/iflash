import { date, integer, pgTable, unique, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'
import { User } from './user-schema.ts'

export const DailyLog = pgTable(
	'daily_logs',
	{
		id: uuid('id').primaryKey().$defaultFn(uuidv7),
		userId: uuid('user_id')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull(),
		date: date('date').defaultNow().notNull(),
		unlockedCount: integer('unlocked_count').default(0).notNull(),
		studiedCount: integer('studied_count').default(0).notNull(),
	},
	(table) => [unique().on(table.userId, table.date)]
)
