import { drizzle } from "drizzle-orm/node-postgres"

import { env } from "../env.ts"

import { DailyLog } from "./schemas/daily-log-schema.ts"
import { ReviewEvent } from "./schemas/review-event-schema.ts"
import { SteakCounter } from "./schemas/steak-counter-schema.ts"
import { StudySession } from "./schemas/study-session-schema.ts"
import { User } from "./schemas/user-schema.ts"
import { UserWord } from "./schemas/user-word-schemas.ts"
import { Word } from "./schemas/word.ts"

export const db = drizzle(env.DATABASE_URL, {
	schema: {
		User,
		Word,
		UserWord,
		StudySession,
		ReviewEvent,
		DailyLog,
		SteakCounter,
	},
	logger: true,
})
