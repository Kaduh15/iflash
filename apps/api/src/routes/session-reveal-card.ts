import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { getSession } from '../db/functions/get-session.ts'
import { getWord } from '../db/functions/get-word.ts'
import { getWordSession } from '../db/functions/get-word-session.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

export const sessionRevealCardRouter: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/session/:id/card/:wordId/reveal',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Session'],
				summary: 'Revelar o cartão de estudo',
				description:
					'Revela o cartão de estudo para a sessão atual do usuário autenticado.',
				params: z.object({
					id: z
						.uuid()
						.describe(
							'ID da sessão de estudo para a qual o cartão será revelado'
						),
					wordId: z
						.uuid()
						.describe('ID da palavra que será revelada no cartão de estudo'),
				}),
				response: {
					[HTTP_STATUS.OK]: z.object({
						word: z
							.object({
								id: z.uuid().describe('ID da palavra'),
								english: z.string().describe('Palavra em inglês'),
								portuguese: z.string().describe('Palavra em português'),
								exampleEn: z.string().nullable().describe('Exemplo em inglês'),
								examplePt: z
									.string()
									.nullable()
									.describe('Exemplo em português'),
							})
							.describe('Palavra revelada no cartão de estudo'),
					}),
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
			const { id: sessionId, wordId } = request.params
			const userId = request.user?.sub

			if (typeof userId !== 'string') {
				return reply
					.status(HTTP_STATUS.UNAUTHORIZED)
					.send({ message: 'Unauthorized' })
			}

			const currentSession = await getSession(userId)

			if (!currentSession || currentSession.id !== sessionId) {
				return reply
					.status(HTTP_STATUS.BAD_REQUEST)
					.send({ message: 'Sessão não encontrada ou inválida' })
			}

			const word = await getWordSession({
				userId,
			})

			if (!word.some((w) => w.id === wordId)) {
				return reply
					.status(HTTP_STATUS.BAD_REQUEST)
					.send({ message: 'Palavra não encontrada na sessão' })
			}

			const { word: revealedWord } = await getWord(wordId)

			return reply.status(HTTP_STATUS.OK).send({ word: revealedWord })
		}
	)
}
