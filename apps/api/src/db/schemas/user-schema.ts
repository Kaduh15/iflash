import {
	date,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

export const User = pgTable('users', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	currentSteak: integer('current_steak').notNull().default(0),
	bestSteak: integer('best_steak').notNull().default(0),
	lastStudyDate: date('last_study_date'),
	lastUnlockedDate: date('last_unlocked_date'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
