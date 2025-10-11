import { addDays, format } from 'date-fns'
import { and, eq, sql } from 'drizzle-orm'
import type { DatabaseTransaction } from '../../@types/transaction.db.ts'
import { db } from '../index.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'

type RegisterReviewWordParams = {
	userId: string
	wordId: string
	result: 'fail' | 'hard' | 'good' | 'easy'
}

export async function registerReviewWord(
	{ userId, wordId, result }: RegisterReviewWordParams,
	tx?: DatabaseTransaction
) {
	const database = tx ?? db

	const HARD_REVIEW_INTERVAL_DAYS = 3
	const GOOD_REVIEW_INTERVAL_DAYS = 7
	const EASY_REVIEW_INTERVAL_DAYS = 14

	const next_review_date = {
		fail: format(addDays(new Date(), 0), 'yyyy-MM-dd'),
		hard: format(addDays(new Date(), HARD_REVIEW_INTERVAL_DAYS), 'yyyy-MM-dd'),
		good: format(addDays(new Date(), GOOD_REVIEW_INTERVAL_DAYS), 'yyyy-MM-dd'),
		easy: format(addDays(new Date(), EASY_REVIEW_INTERVAL_DAYS), 'yyyy-MM-dd'),
	}

	const [register] = await database
		.update(UserWord)
		.set({
			lapses: sql`CASE WHEN ${result} = 'fail' THEN ${UserWord.lapses} + 1 ELSE ${UserWord.lapses} END`,
      lastResult: result,
      lastSeenAt: new Date(),
			seenCount: sql`${UserWord.seenCount} + 1`,
			nextReviewDate: next_review_date[result],
		})
		.where(and(eq(UserWord.userId, userId), eq(UserWord.wordId, wordId)))
		.returning()

	return { newUserWord: register }
}
