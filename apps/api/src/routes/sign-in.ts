import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { getUserByEmail } from '../db/functions/get-user-by-email.ts'
import { registerLogin } from '../db/functions/register-login.ts'
import { verifyHash } from '../utils/crypt.ts'
import { createToken } from '../utils/jwt.ts'

const PASSWORD_MIN_LENGTH = 8 as const

export const authSignInRouter: FastifyPluginCallbackZod = (app) => {
	app.post(
		'/auth/sign-in',
		{
			schema: {
				tags: ['Auth'],
				body: z.object({
					email: z.email().describe('Email do usuário'),
					password: z
						.string()
						.min(
							PASSWORD_MIN_LENGTH,
							`Senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`
						)
						.describe('Senha do usuário'),
				}),
				response: {
					[HTTP_STATUS.OK]: z.null().describe('Login realizado com sucesso'),
					[HTTP_STATUS.UNAUTHORIZED]: z
						.object({
							message: z.string().default('Email ou senha inválidos'),
						})
						.describe('Email ou senha inválidos'),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body

			const result = await getUserByEmail(email)
			if (
				!(
					result &&
					(await verifyHash({ password, passwordHash: result.user.password }))
				)
			) {
				return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
					message: 'Email ou senha inválidos',
				})
			}

			const { user } = result

			const token = createToken({
				sub: user.id,
			})

			await registerLogin(user.id)

			return reply.setCookie('token', token).status(HTTP_STATUS.OK).send()
		}
	)
}
