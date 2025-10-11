import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { createStudySession } from '../db/functions/create-study-session.ts'
import { getWordsReview } from '../db/functions/get-words-review.ts'
import { hasUnlockedWordToday } from '../db/functions/has-unlocked-word-today.ts'
import { unlockedWord } from '../db/functions/unlocked-word.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

export const StudyStartRouter: FastifyPluginCallbackZod = async (app) => {
	app.post(
		'/study/start',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Study'],
				summary: 'Start a new study session',
				response: {
					[HTTP_STATUS.CREATED]: z.object({
						sessionId: z.uuid(),
						newWordUnlocked: z.boolean(),
						word: z.object({
							id: z.uuid().nullable(),
							text: z.string().nullable(),
						}),
						progress: z.object({
							current: z.number().min(1),
							total: z.number().min(0),
						}),
					}),
					[HTTP_STATUS.UNAUTHORIZED]: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user?.sub

			if (!userId || typeof userId !== 'string') {
				return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
					message: 'Unauthorized',
				})
			}

			let newWordUnlocked:
				| Awaited<ReturnType<typeof unlockedWord>>['wordUnlocked'][0]
				| null = null

			if (!(await hasUnlockedWordToday(userId))) {
				newWordUnlocked = (await unlockedWord({ userId, quantity: 1 }))
					.wordUnlocked[0]
			}

			const { wordsReview } = await getWordsReview(userId)

			const { newSession } = await createStudySession(userId)

			return reply.status(HTTP_STATUS.CREATED).send({
				sessionId: newSession.id,
				newWordUnlocked: !!newWordUnlocked,
				word: {
					id: wordsReview[0].wordId ?? null,
					text: wordsReview[0].english ?? null,
				},
				progress: { current: 1, total: wordsReview.length },
			})
		}
	)
}
