import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { Word } from '../schemas/word.ts'

export async function getWordById(wordId: string) {
	const [word] = await db.select().from(Word).where(eq(Word.id, wordId))

	return { word }
}
