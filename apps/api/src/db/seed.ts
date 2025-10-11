import { reset } from 'drizzle-seed'
import { dataWorld } from './data-world.ts'
import { db } from './index.ts'
import { schema } from './schemas/index.ts'
import { Word } from './schemas/word.ts'

async function main() {
	await reset(db, schema)

	const words: (typeof Word.$inferInsert)[] = dataWorld.map(
		({ english, exampleEn, examplePt, portuguese }) => {
			return {
				english,
				portuguese,
				exampleEn,
				examplePt,
			}
		}
	)

	await db.insert(Word).values([...words])

	console.info('Database seeded successfully.')
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
