import { db } from '../index.ts'
import { User } from '../schemas/user-schema.ts'

export type UserCreateSchema = typeof User.$inferInsert

export async function createUser({ email, name, password }: UserCreateSchema) {
	const [result] = await db
		.insert(User)
		.values({
			email,
			name,
			password,
		})
		.returning()

	const { password: _, ...user } = result

	return user
}
