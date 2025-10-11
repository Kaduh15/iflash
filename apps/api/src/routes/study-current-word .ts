import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { getWordById } from '../db/functions/get-word-by-id.ts'
import { getWordsReview } from '../db/functions/get-words-review.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

export const StudyCurrentWordRouter: FastifyPluginCallbackZod = async (app) => {
	app.get(
		'/study/:sessionId/current',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Study'],
				summary: 'Get the current word to review',
				response: {
					[HTTP_STATUS.OK]: z.object({
						word: z.object({
							id: z.uuid(),
							english: z.string(),
							portuguese: z.string(),
							exampleEn: z.string().nullable(),
							examplePt: z.string().nullable(),
							isActive: z.boolean(),
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

			const { wordsReview } = await getWordsReview(userId)

			if (wordsReview.length === 0) {
				return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
					message:
						'No words available for review. Please unlock new words first.',
				})
			}

			const { word } = await getWordById(wordsReview[0].wordId)

			return reply.status(HTTP_STATUS.OK).send({
				word,
			})
		}
	)
}
