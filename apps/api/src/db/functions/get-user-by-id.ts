import { eq } from 'drizzle-orm'
import { db } from '../index.ts'
import { User } from '../schemas/user-schema.ts'

export async function getUserById(id: string) {
	const [user] = await db.select().from(User).where(eq(User.id, id))

	if (!user) {
		return
	}

	return { user }
}
