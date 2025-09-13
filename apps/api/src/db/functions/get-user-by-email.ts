import { eq } from "drizzle-orm";
import { db } from "../index.ts";
import { users } from "../schemas/userSchema.ts";

export async function getUserByEmail(email: string) {
	const [user] = await db.select().from(users).where(eq(users.email, email));

  if(!user) {
    return
  }

	return { user };
}
