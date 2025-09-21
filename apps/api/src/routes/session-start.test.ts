import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app } from '../app.ts'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { registerDailyLogs } from '../db/functions/register-daily-logs.ts'
import { unlockedWord } from '../db/functions/unlocked-word.ts'
import { makeUser } from '../tests/factories/make-user.ts'
import { createToken } from '../utils/jwt.ts'

describe('session-start route', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	test('should start a session', async () => {
		const { user } = await makeUser()

		await unlockedWord({ userId: user.id, quantity: 2 })

		await registerDailyLogs({ userId: user.id, unlockedCount: 2 })

		const token = createToken({ sub: user.id })

		const response1 = await request(app.server)
			.post('/session/start')
			.send()
			.set('Cookie', [`token=${token}`])

		expect(response1.status).toBe(HTTP_STATUS.CREATED)

		const response2 = await request(app.server)
			.post('/session/start')
			.send()
			.set('Cookie', [`token=${token}`])

		expect(response2.status).toBe(HTTP_STATUS.OK)
	})
})
