import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { getWordById } from '../db/functions/get-word-by-id.ts'
import { getWordsReview } from '../db/functions/get-words-review.ts'
import { registerReviewEvents } from '../db/functions/register-review-events.ts'
import { registerReviewWord } from '../db/functions/register-review-word.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

export const StudyReviewWordRouter: FastifyPluginCallbackZod = async (app) => {
	app.post(
		'/study/:sessionId/review',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Study'],
				summary: '',
				body: z.object({
					result: z.enum(['fail', 'hard', 'good', 'easy']),
				}),
				params: z.object({
					sessionId: z.uuid(),
				}),
				response: {
					[HTTP_STATUS.OK]: z.object({
						nextWord: z
							.object({
								id: z.uuid(),
								english: z.string(),
							})
							.nullable(),
						done: z.boolean().optional(),
					}),
					[HTTP_STATUS.UNAUTHORIZED]: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const userId = request.user?.sub
			const { result } = request.body

			if (!userId || typeof userId !== 'string') {
				return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
					message: 'Unauthorized',
				})
			}

			const { wordsReview } = await getWordsReview(userId)

			if (wordsReview.length === 0) {
				return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
					message:
						'No words available for review. Please unlock new words first.',
				})
			}

			const { word } = await getWordById(wordsReview[0].wordId)

			await registerReviewEvents({
				result,
				userId,
				wordId: word.id,
				sessionId: request.params.sessionId,
			})

			await registerReviewWord({
				userId,
				wordId: word.id,
				result,
			})

			const { word: nextWord } = await getWordById(wordsReview[1]?.wordId ?? '')
			if (!nextWord) {
				return reply.status(HTTP_STATUS.OK).send({ nextWord: null, done: true })
			}

			return reply.status(HTTP_STATUS.OK).send({
				nextWord: {
					id: nextWord.id,
					english: nextWord.english,
				},
			})
		}
	)
}
