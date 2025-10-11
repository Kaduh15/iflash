import type { DatabaseTransaction } from '../../@types/transaction.db.ts'
import { getNow } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { StudySession } from '../schemas/study-session-schema.ts'

export async function createStudySession(
	userId: string,
	tx?: DatabaseTransaction
) {
	const database = tx ?? db

	const [newSession] = await database
		.insert(StudySession)
		.values({
			userId,
			startedAt: getNow(),
		})
		.returning()

	return { newSession }
}
