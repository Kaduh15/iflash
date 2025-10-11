import { date, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'

import { StudySession } from './study-session-schema.ts'
import { User } from './user-schema.ts'
import { resultSchema } from './user-word-schemas.ts'
import { Word } from './word.ts'

export const ReviewEvent = pgTable('review_events', {
	id: uuid('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	sessionId: uuid('session_id')
		.references(() => StudySession.id, { onDelete: 'cascade' })
		.notNull(),
	userId: uuid('user_id')
		.references(() => User.id, { onDelete: 'cascade' })
		.notNull(),
	wordId: uuid('word_id')
		.references(() => Word.id, { onDelete: 'cascade' })
		.notNull(),
	result: resultSchema('result').notNull(),
	next_review_date: date('next_review_date').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true })
		.defaultNow()
		.notNull(),
})
