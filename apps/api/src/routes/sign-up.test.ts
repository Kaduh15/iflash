import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app } from '../app.ts'
import { HTTP_STATUS } from '../constants/https-status.ts'

const tokenCookieRegex = /^token=.+; Path=\/; HttpOnly; SameSite=Strict/

describe('POST /auth/sing-up', async () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	test('should return HTTP 201 on successful sign-up', async () => {
		const email = `user${Date.now()}@example.com`
		const password = 'password123'

		const res = await request(app.server).post('/auth/sign-up').send({
			name: 'John Doe',
			email,
			password,
		})

		expect(res.status).toBe(HTTP_STATUS.CREATED)
		expect(res.headers['set-cookie'][0]).toMatch(tokenCookieRegex)
	})
})
