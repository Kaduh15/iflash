import { and, eq, lte } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'
import { Word } from '../schemas/word.ts'

type GetWordSessionInput = {
	userId: string
}

export async function getWordSession({ userId }: GetWordSessionInput) {
	const session = await db
		.select({
			id: Word.id,
			english: Word.english,
		})
		.from(UserWord)
		.where(
			and(eq(UserWord.userId, userId), lte(UserWord.nextReviewDate, getToday()))
		)
		.innerJoin(Word, eq(Word.id, UserWord.wordId))

	return session
}
