import { eq, sql } from 'drizzle-orm'

import { db } from '../index.ts'
import { User } from '../schemas/user-schema.ts'

export async function registerLogin(id: string): Promise<void> {
	try {
		await db
			.update(User)
			.set({
				lastLoginAt: sql`NOW()`,
			})
			.where(eq(User.id, id))
			.returning()
	} catch (error) {
		console.error('Failed to register login:', error)
		// Não lança o erro para não quebrar o fluxo de login
	}
}
