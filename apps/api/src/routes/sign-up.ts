import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { HTTP_STATUS } from '../constants/https-status.ts'
import { createUser } from '../db/functions/create-user.ts'
import { getUserByEmail } from '../db/functions/get-user-by-email.ts'
import { hash } from '../utils/crypt.ts'
import { createToken } from '../utils/jwt.ts'

const PASSWORD_MIN_LENGTH = 8 as const
const NAME_MIN_LENGTH = 4 as const

export const authSignUpRouter: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/auth/sign-up',
		{
			schema: {
				tags: ['Auth'],
				body: z.object({
					name: z
						.string()
						.min(
							NAME_MIN_LENGTH,
							`Nome precisa ter pelo menos ${NAME_MIN_LENGTH} caracteres`
						)
						.describe('Nome do usuário'),
					email: z.email().describe('Email do usuário').toLowerCase(),
					password: z
						.string()
						.min(
							PASSWORD_MIN_LENGTH,
							`Senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`
						)
						.describe('Senha do usuário'),
				}),
				response: {
					[HTTP_STATUS.CREATED]: z
						.null()
						.describe('Usuário criado com sucesso!'),
					[HTTP_STATUS.CONFLICT]: z
						.object({
							message: z.string(),
						})
						.describe('Mensagem de erro indicando conflito'),
					[HTTP_STATUS.INTERNAL_SERVER_ERROR]: z
						.object({
							message: z.string(),
						})
						.describe('Erro interno do servidor'),
				},
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body

			const hasUser = await getUserByEmail(email)

			if (hasUser) {
				return reply.status(HTTP_STATUS.CONFLICT).send({
					message: 'Email já está em uso',
				})
			}

			const passwordHash = await hash(password)

			const user = await createUser({ email, name, password: passwordHash })

			const token = createToken({
				sub: user.id,
			})

			return reply.setCookie('token', token).status(HTTP_STATUS.CREATED).send()
		}
	)
}
