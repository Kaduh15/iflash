import { drizzle } from "drizzle-orm/node-postgres"

import { env } from "../env.ts"

import { schema } from "./schemas/index.ts"

export const db = drizzle(env.DATABASE_URL, {
	schema,
	logger: true,
})
