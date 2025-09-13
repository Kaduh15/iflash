import { eq } from "drizzle-orm"
import { db } from "../index.ts"
import { User } from "../schemas/user-schema.ts"

export async function getUserByEmail(email: string) {
	const [user] = await db.select().from(User).where(eq(User.email, email))

	if (!user) {
		return
	}

	return { user }
}
