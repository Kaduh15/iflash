import { and, asc, eq, lte, sql } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'
import { Word } from '../schemas/word.ts'

export async function getWordsReview(userId: string) {
	const words = await db
		.select({
			wordId: UserWord.wordId,
			english: Word.english,
		})
		.from(UserWord)
		.where(
			and(eq(UserWord.userId, userId), lte(UserWord.nextReviewDate, getToday()))
		)
		.innerJoin(Word, eq(UserWord.wordId, Word.id))
		.orderBy(
			sql`
        CASE
          WHEN ${UserWord.lastResult} IS NULL THEN 0
          WHEN ${UserWord.lastResult} = 'fail' THEN 2
          ELSE 1
        END
      `,
			asc(UserWord.nextReviewDate)
		)

	return { wordsReview: words }
}
