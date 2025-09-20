import request from 'supertest'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { app } from '../app.ts'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { makeUser } from '../tests/factories/make-user.ts'
import { createToken } from '../utils/jwt.ts'

describe('GET /boot', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	test('returns authenticated user data', async () => {
		await app.ready()

		const { user } = await makeUser()
		const authToken = createToken({ sub: user.id })

		const response = await request(app.server)
			.get('/boot')
			.set('Cookie', [`token=${authToken}`])

		expect(response.status).toEqual(HTTP_STATUS.CREATED)
		expect(response.body).toEqual({
			dailyLog: {
				id: expect.any(String),
				userId: user.id,
				date: expect.any(String),
				unlockedCount: expect.any(Number),
			},
		})
	})

	test('returns correct status for consecutive requests on different days', async () => {
		await app.ready()

		const { user } = await makeUser()
		const authToken = createToken({ sub: user.id })

		await request(app.server)
			.get('/boot')
			.set('Cookie', [`token=${authToken}`])

		const currentDate = new Date()
		const nextDay = new Date(currentDate)
		nextDay.setDate(currentDate.getDate() + 1)

		vi.setSystemTime(nextDay)

		const responseNextDay = await request(app.server)
			.get('/boot')
			.set('Cookie', [`token=${authToken}`])

		expect(responseNextDay.status).toEqual(HTTP_STATUS.CREATED)

		const responseSameDay = await request(app.server)
			.get('/boot')
			.set('Cookie', [`token=${authToken}`])

		expect(responseSameDay.status).toEqual(HTTP_STATUS.OK)
	})
})
