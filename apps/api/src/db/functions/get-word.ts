import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { schema } from '../schemas/index.ts'

export async function getWord(wordId: string) {
	const [word] = await db
		.select()
		.from(schema.Word)
		.where(eq(schema.Word.id, wordId))
		.limit(1)

	return { word }
}
