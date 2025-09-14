import { randomUUID } from 'node:crypto'
import { fakerPT_BR } from '@faker-js/faker'
import type { InferSelectModel } from 'drizzle-orm'

import { db } from '../../db/index.ts'
import { User } from '../../db/schemas/user-schema.ts'
import { hash } from '../../utils/crypt.ts'

type UserType = InferSelectModel<typeof User>

interface MakeUserReturn {
	user: UserType
	passwordBeforeHash: string
}

export async function makeUser(): Promise<MakeUserReturn> {
	const passwordBeforeHash = randomUUID()

	const [user] = await db
		.insert(User)
		.values({
			name: fakerPT_BR.person.fullName(),
			email: fakerPT_BR.internet.email(),
			password: await hash(passwordBeforeHash),
		})
		.returning()

	return {
		user,
		passwordBeforeHash,
	}
}
