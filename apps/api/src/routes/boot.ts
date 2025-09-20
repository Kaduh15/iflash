import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { HTTP_STATUS } from '../constants/https-status.ts'
import { getDailyLog } from '../db/functions/get-daily-log.ts'
import { getWordsUnlocked } from '../db/functions/get-word-unlocked.ts'
import { registerDailyLogs } from '../db/functions/register-daily-logs.ts'
import { unlockedWord } from '../db/functions/unlocked-word.ts'
import { checkTokenRequest } from './hooks/check-token-request.ts'

const INITIAL_WORDS_UNLOCKED_COUNT = 5
const DEFAULT_WORDS_UNLOCKED_COUNT = 1

export const bootRouter: FastifyPluginCallbackZod = (app) => {
	app.get(
		'/boot',
		{
			preHandler: [checkTokenRequest],
			schema: {
				tags: ['System'],
				response: {
					[HTTP_STATUS.CREATED]: z
						.object({
							dailyLog: z.object({
								id: z.uuid().describe('ID do log diário'),
								userId: z.uuid().describe('ID do usuário'),
								date: z.string().describe('Data do log diário'),
								unlockedCount: z
									.number()
									.describe('Quantidade de palavras desbloqueadas'),
							}),
						})
						.describe('Log diário criado com sucesso'),
					[HTTP_STATUS.OK]: z
						.object({
							dailyLog: z.object({
								id: z.uuid().describe('ID do log diário'),
								userId: z.uuid().describe('ID do usuário'),
								date: z.string().describe('Data do log diário'),
								unlockedCount: z
									.number()
									.describe('Quantidade de palavras desbloqueadas'),
							}),
						})
						.describe('Log diário retornado com sucesso'),
					[HTTP_STATUS.UNAUTHORIZED]: z
						.object({
							message: z.string().default('Unauthorized'),
						})
						.describe('Usuário não autorizado')
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

			const { dailyLog } = await getDailyLog({
				userId,
			})

			if (!dailyLog) {
				const { wordsUnlocked } = await getWordsUnlocked(userId)

				await unlockedWord({
					userId,
					quantity:
						wordsUnlocked === 0
							? INITIAL_WORDS_UNLOCKED_COUNT
							: DEFAULT_WORDS_UNLOCKED_COUNT,
				})

				const { dailyLogRegister } = await registerDailyLogs({
					userId,
					unlockedCount:
						wordsUnlocked === 0
							? INITIAL_WORDS_UNLOCKED_COUNT
							: DEFAULT_WORDS_UNLOCKED_COUNT,
				})

				return reply.status(HTTP_STATUS.CREATED).send({
					dailyLog: dailyLogRegister,
				})
			}

			return reply.status(HTTP_STATUS.OK).send({
				dailyLog,
			})
		}
	)
}
