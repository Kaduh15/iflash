import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { getUserById } from '../db/functions/get-user-by-id.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

export const getMe: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/me',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['Me'],
				response: {
					[HTTP_STATUS.OK]: z
						.object({
							user: z.object({
								id: z.uuid().describe('ID do usuário'),
								name: z.string().describe('Nome do usuário'),
								email: z.email().describe('Email do usuário'),
								lastLoginAt: z
									.date()
									.nullable()
									.describe('Data de último login'),
								createdAt: z.date().nullable().describe('Data de criação'),
								updatedAt: z.date().nullable().describe('Última atualização'),
							}),
						})
						.describe('Usuário autenticado retornado com sucesso'),
					[HTTP_STATUS.UNAUTHORIZED]: z
						.object({
							message: z
								.string()
								.default('Token inválido ou usuário não encontrado'),
						})
						.describe('Usuário não autorizado'),
					[HTTP_STATUS.INTERNAL_SERVER_ERROR]: z
						.object({
							message: z.string().default('Erro interno ao validar usuário'),
						})
						.describe('Erro interno do servidor'),
				},
			},
		},
		async (request, reply) => {
			const userRequest = request.user

			if (!userRequest?.sub || typeof userRequest === 'string') {
				return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
					message: 'Erro interno ao validar usuário',
				})
			}

			const result = await getUserById(userRequest.sub)

			if (!result) {
				return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
					message: 'Token inválido ou usuário não encontrado',
				})
			}

			const { password: _, ...user } = result.user

			return reply.status(HTTP_STATUS.OK).send({ user })
		}
	)
}
