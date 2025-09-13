import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../env.ts";

import { dailyLogs } from "./schemas/dailyLogsSchema.ts";
import { reviewEvents } from "./schemas/reviewEventsSchema.ts";
import { studySessions } from "./schemas/studySessionsSchema.ts";
import { users } from "./schemas/userSchema.ts";
import { userWords } from "./schemas/userWordsSchemas.ts";
import { words } from "./schemas/words.ts";

export const db = drizzle(env.DATABASE_URL, {
	schema: { users, words, userWords, studySessions, reviewEvents, dailyLogs },
	logger: true,
});
