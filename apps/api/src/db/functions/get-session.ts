import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '../index.ts'
import { StudySession } from '../schemas/study-session-schema.ts'

export async function getSession(userId: string) {
	const [session] = await db
		.select()
		.from(StudySession)
		.where(and(eq(StudySession.userId, userId), isNull(StudySession.endedAt)))
		.orderBy(desc(StudySession.startedAt))

	return session
}
