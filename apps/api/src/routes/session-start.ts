import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { createSession } from '../db/functions/create-session.ts'
import { getSession } from '../db/functions/get-session.ts'
import { getWordSession } from '../db/functions/get-word-session.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

const sessionSchema = z.object({
	id: z.uuid(),
	startedAt: z.date(),
	cardsTotalPlanned: z.number().min(1),
})

const queueItemSchema = z.object({
	id: z.uuid(),
	english: z.string(),
})

const sessionResponseSchema = z.object({
	session: sessionSchema,
	queue: z.array(queueItemSchema),
})

const unauthorizedResponseSchema = z.object({
	message: z.string(),
})

export const sessionStartRouter: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/session/start',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Session'],
				response: {
					[HTTP_STATUS.CREATED]: sessionResponseSchema.describe(
						'Detalhes da sessão de estudo criada'
					),
					[HTTP_STATUS.OK]: sessionResponseSchema.describe(
						'Detalhes da sessão de estudo iniciada'
					),
					[HTTP_STATUS.UNAUTHORIZED]: unauthorizedResponseSchema.describe(
						'Usuário não autenticado'
					),
				},
			},
		},
		async (request, reply) => {
			const { user } = request

			if (!user?.sub || typeof user.sub !== 'string') {
				return reply
					.status(HTTP_STATUS.UNAUTHORIZED)
					.send({ message: 'Unauthorized' })
			}

			const existingSession = await getSession(user.sub)

			if (existingSession) {
				const wordSession = await getWordSession({
					userId: existingSession.userId,
				})

				return reply.status(HTTP_STATUS.OK).send({
					session: {
						id: existingSession.id,
						startedAt: new Date(existingSession.startedAt),
						cardsTotalPlanned: existingSession.cardsTotalPlanned,
					},
					queue: wordSession,
				})
			}

			const { session, queue } = await createSession(user.sub)

			return reply.status(HTTP_STATUS.CREATED).send({
				session: {
					id: session.id,
					startedAt: new Date(session.startedAt),
					cardsTotalPlanned: session.cardsTotalPlanned,
				},
				queue,
			})
		}
	)
}
