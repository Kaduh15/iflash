import { DailyLog } from './daily-log-schema.ts'
import { ReviewEvent } from './review-event-schema.ts'
import { SteakCounter } from './steak-counter-schema.ts'
import { StudySession } from './study-session-schema.ts'
import { User } from './user-schema.ts'
import { UserWord } from './user-word-schemas.ts'
import { Word } from './word.ts'

export const schema = {
	User,
	Word,
	UserWord,
	StudySession,
	ReviewEvent,
	DailyLog,
	SteakCounter,
}
