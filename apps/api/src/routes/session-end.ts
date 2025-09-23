import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { closeSession } from '../db/functions/close-session.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

export const sessionEndRouter: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/session/:id/end',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Session'],
				summary: 'Finalizar a sessão de estudo atual',
				description:
					'Finaliza a sessão de estudo atual para o usuário autenticado.',
				params: z.object({
					id: z.uuid().describe('ID da sessão de estudo a ser finalizada'),
				}),
				body: z
					.object({
						reason: z.enum(['completed', 'quit']).describe('Motivo do término'),
					})
					.optional(),
				response: {
					[HTTP_STATUS.OK]: z
						.null()
						.describe('Sem Conteúdo - A sessão foi finalizada com sucesso.'),
					[HTTP_STATUS.BAD_REQUEST]: z
						.object({
							message: z.string(),
						})
						.describe('Requisição Inválida - A solicitação foi inválida.'),
					[HTTP_STATUS.UNAUTHORIZED]: z
						.object({
							message: z.string(),
						})
						.describe(
							'Não Autorizado - O token de autenticação está ausente ou inválido.'
						),
				},
			},
		},
		async (request, reply) => {
			const { id: sessionId } = request.params
			const userId = request.user?.sub

			if (!userId) {
				return reply
					.status(HTTP_STATUS.UNAUTHORIZED)
					.send({ message: 'Unauthorized' })
			}

			const sessionClosed = await closeSession({ sessionId })

			if (!sessionClosed) {
				return reply
					.status(HTTP_STATUS.BAD_REQUEST)
					.send({ message: 'Sessão não encontrada ou já finalizada' })
			}

			return reply.status(HTTP_STATUS.OK).send()
		}
	)
}
