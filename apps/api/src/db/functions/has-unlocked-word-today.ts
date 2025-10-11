import { and, eq, isNull, lt, or } from 'drizzle-orm'
import { getToday } from '../../utils/get-today.ts'
import { db } from '../index.ts'
import { User } from '../schemas/user-schema.ts'

export async function hasUnlockedWordToday(userId: string) {
	const [user] = await db
		.select()
		.from(User)
		.where(
			and(
				eq(User.id, userId),
				or(lt(User.lastUnlockedDate, getToday()), isNull(User.lastUnlockedDate))
			)
		)

	return !!user
}
