import type { DatabaseTransaction } from '../../@types/transaction.db.ts'
import { db } from '../index.ts'
import { User } from '../schemas/user-schema.ts'

export type UserCreateSchema = typeof User.$inferInsert

export async function createUser(
	{ email, name, password }: UserCreateSchema,
	tx?: DatabaseTransaction
) {
	const [result] = await (tx ?? db)
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
