import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'

export const authLogout: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/auth/logout',
		{
			schema: {
				tags: ['Auth'],
				response: {
					[HTTP_STATUS.NO_CONTENT]: z
						.null()
						.describe('Logout realizado com sucesso'),
				},
			},
		},
		async (_, reply) => {
			return reply.clearCookie('token').status(HTTP_STATUS.NO_CONTENT).send()
		}
	)
}
