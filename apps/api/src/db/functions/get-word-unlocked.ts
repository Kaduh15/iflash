import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'

export async function getWordsUnlocked(userId: string) {
	const wordsUnlocked = await db.$count(UserWord, eq(UserWord.userId, userId))

	return { wordsUnlocked }
}
