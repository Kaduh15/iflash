import {
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'
import { v7 as uuidv7 } from 'uuid'
import { User } from './user-schema.ts'
import { Word } from './word.ts'

export const resultSchema = pgEnum('result', ['fail', 'hard', 'good', 'easy'])

export const UserWord = pgTable(
	'user_words',
	{
		id: uuid('id').primaryKey().$defaultFn(uuidv7),
		userId: uuid('user_id')
			.references(() => User.id, { onDelete: 'cascade' })
			.notNull(),
		wordId: uuid('word_id')
			.references(() => Word.id, { onDelete: 'cascade' })
			.notNull(),
		nextReviewDate: date('next_review_date'),
		lapses: integer('lapses').default(0).notNull(),
		seenCount: integer('seen_count').default(0).notNull(),
		lastResult: resultSchema('last_result'),
		lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
	},
	(table) => [
		index('idx_user_words_user_id').on(table.userId),
		index('idx_user_words_next_review_date').on(table.nextReviewDate),
	]
)
