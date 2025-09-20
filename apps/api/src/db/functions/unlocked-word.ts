import { eq, notInArray, sql } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'
import { Word } from '../schemas/word.ts'

type UnlockedWordInput = {
	userId: string
	quantity?: number
}

export async function unlockedWord({
	userId,
	quantity = 1,
}: UnlockedWordInput) {
	const wordsUnlocked = await db
		.select({ wordId: UserWord.wordId })
		.from(UserWord)
		.where(eq(UserWord.userId, userId))

	const words = await db
		.select()
		.from(Word)
		.where(
			notInArray(
				Word.id,
				wordsUnlocked.map((w) => w.wordId)
			)
		)
		.limit(quantity)
		.orderBy(sql`RANDOM()`)

	if (words.length === 0) {
		return
	}

	type UserWordInsertValuesType = typeof UserWord.$inferInsert

	const userWords: UserWordInsertValuesType[] = words.map((word) => ({
		userId,
		wordId: word.id,
		status: 'unlocked',
		nextReviewDate: getToday(),
	}))

	const inserts = await db.insert(UserWord).values(userWords).returning()

	return { inserts }
}
