import { fakerEN, fakerPT_BR } from '@faker-js/faker'
import { reset } from 'drizzle-seed'
import { db } from './index.ts'
import { schema } from './schemas/index.ts'
import { Word } from './schemas/word.ts'

async function main() {
	await reset(db, schema)

	const words: (typeof Word.$inferInsert)[] = Array.from({
		length: 100,
	}).map(() => {
		const english = fakerEN.word.sample()
		const portuguese = fakerPT_BR.word.sample()

		return {
			english,
			portuguese,
			exampleEn: `This is an example sentence with the word "${english}".`,
			examplePt: `Esta é uma frase de exemplo com a palavra "${portuguese}".`,
		}
	})

	await db.insert(Word).values([...words])
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
