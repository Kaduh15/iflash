import { addDays, format } from 'date-fns'
import type { DatabaseTransaction } from '../../@types/transaction.db.ts'
import { db } from '../index.ts'
import { ReviewEvent } from '../schemas/review-event-schema.ts'

type RegisterReviewEventsParams = {
	userId: string
	wordId: string
	sessionId: string
	result: 'fail' | 'hard' | 'good' | 'easy'
}

export async function registerReviewEvents(
	{ result, userId, wordId, sessionId }: RegisterReviewEventsParams,
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
		.insert(ReviewEvent)
		.values({
			result,
			userId,
			wordId,
			sessionId,
			next_review_date: next_review_date[result],
		})
		.returning()

	return { newReviewEvent: register }
}
