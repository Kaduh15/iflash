import { db } from "../index.ts";
import { users } from "../schemas/userSchema.ts";

export type UserCreateSchema = typeof users.$inferInsert;

export async function createUser({ email, name, password }: UserCreateSchema) {
	const [result] = await db
		.insert(users)
		.values({
			email,
			name,
			password,
		})
		.returning();

	const { password: _, ...user } = result;

	return user;
}
