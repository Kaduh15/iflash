import { and, eq } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { DailyLog } from '../schemas/daily-log-schema.ts'

type UpdateDailyLogInput = {
	userId: string
	unlockedCount: number
	date?: string
	studiedCount?: number
}

export async function updateDailyLog({
	userId,
	unlockedCount,
	date = getToday(),
	studiedCount,
}: UpdateDailyLogInput) {
	const [updatedLog] = await db
		.update(DailyLog)
		.set({ unlockedCount, studiedCount })
		.where(and(eq(DailyLog.userId, userId), eq(DailyLog.date, date)))
		.returning()

	return { updatedLog }
}
