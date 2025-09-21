import { and, eq, lte } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { StudySession } from '../schemas/study-session-schema.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'
import { Word } from '../schemas/word.ts'

export async function createSession(userId: string) {
	const wordsToSession = await db
		.select()
		.from(UserWord)
		.where(
			and(eq(UserWord.userId, userId), lte(UserWord.nextReviewDate, getToday()))
		)
		.innerJoin(Word, eq(Word.id, UserWord.wordId))

	const cardsTotalPlanned = wordsToSession.length
	

	if (cardsTotalPlanned === 0) {
		throw new Error('No cards available for study session')
	}

	const [session] = await db
		.insert(StudySession)
		.values({
			userId,
			cardsTotalPlanned,
		})
		.returning()

	return {
		session: {
			id: session.id,
			startedAt: session.startedAt,
			cardsTotalPlanned: session.cardsTotalPlanned,
		},
		queue: wordsToSession.map(({ words }) => ({
			id: words.id,
			english: words.english,
		})),
	}
}
