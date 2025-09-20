import { and, eq } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { DailyLog } from '../schemas/daily-log-schema.ts'

type GetDailyLogInput = {
	userId: string
	today?: string
}

export async function getDailyLog({
	userId,
	today = getToday(),
}: GetDailyLogInput) {
	const [dailyLog] = await db
		.select()
		.from(DailyLog)
		.where(and(eq(DailyLog.userId, userId), eq(DailyLog.date, today)))

	return { dailyLog }
}
