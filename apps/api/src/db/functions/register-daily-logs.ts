import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { DailyLog } from '../schemas/daily-log-schema.ts'

type RegisterDailyLogsInput = {
	userId: string
	unlockedCount?: number
}

export async function registerDailyLogs({
	userId,
	unlockedCount = 0,
}: RegisterDailyLogsInput) {
	const today = getToday()

	const [dailyLogRegister] = await db
		.insert(DailyLog)
		.values([
			{
				userId,
				unlockedCount,
				date: today,
			},
		])
		.returning()

	return { dailyLogRegister }
}
