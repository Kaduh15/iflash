import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../env.ts";

import { dailyLogs } from "./schemas/dailyLogsSchema.ts";
import { reviewEvents } from "./schemas/reviewEventsSchema.ts";
import { studySessions } from "./schemas/studySessionsSchema.ts";
import { users } from "./schemas/userSchema.ts";
import { userWords } from "./schemas/userWordsSchemas.ts";
import { words } from "./schemas/words.ts";

export const client = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(client, {
	schema: { users, words, userWords, studySessions, reviewEvents, dailyLogs },
	logger: true,
});
