import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../index.ts'
import { StudySession } from '../schemas/study-session-schema.ts'

type CloseSessionInput = {
	sessionId: string
}

export async function closeSession({ sessionId }: CloseSessionInput) {
	const [result] = await db
		.update(StudySession)
		.set({
			endedAt: new Date(Date.now()),
		})
		.where(and(eq(StudySession.id, sessionId), isNull(StudySession.endedAt)))
		.returning()

	return result
}
