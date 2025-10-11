import { and, eq, isNull, lt, notExists, or, sql } from 'drizzle-orm'
import type { DatabaseTransaction } from '../../@types/transaction.db.ts'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { User } from '../schemas/user-schema.ts'
import { UserWord } from '../schemas/user-word-schemas.ts'
import { Word } from '../schemas/word.ts'

type UnlockedWordParams = {
	userId: string
	quantity?: number
}

export async function unlockedWord(
	{ userId, quantity }: UnlockedWordParams,
	tx?: DatabaseTransaction
) {
	const database = tx ?? db
	const quantityFinal = quantity ?? 1

	const [user] = await database
		.select()
		.from(User)
		.where(
			and(
				eq(User.id, userId),
				or(lt(User.lastUnlockedDate, getToday()), isNull(User.lastUnlockedDate))
			)
		)

	if (!user) {
		throw new Error(
			'User not found or already unlocked words today. You can unlock words once every 24 hours.'
		)
	}

	return database.transaction(async (transaction) => {
		const lockedWords = await transaction
			.select()
			.from(Word)
			.where(
				notExists(
					db
						.select()
						.from(UserWord)
						.where(
							and(eq(UserWord.userId, userId), eq(UserWord.wordId, Word.id))
						)
				)
			)
			.orderBy(sql`RANDOM()`)
			.limit(quantityFinal)

		if (lockedWords.length === 0) {
			return { wordUnlocked: [] }
		}

		const unlockedWords = await transaction
			.insert(UserWord)
			.values(
				lockedWords.map((word) => ({
					userId,
					wordId: word.id,
					nextReviewDate: getToday(),
				}))
			)
			.returning()

		await transaction.update(User).set({
			lastUnlockedDate: getToday(),
		})

		return { wordUnlocked: unlockedWords }
	})
}
