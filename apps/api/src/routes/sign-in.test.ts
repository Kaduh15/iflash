import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app } from '../app.ts'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { makeUser } from '../tests/factories/make-user.ts'

const TOKEN_COOKIE_REGEX = /^token=.+; Path=\/; HttpOnly; SameSite=Strict/

describe('POST /auth/sign-in', async () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	test('should return HTTP 204 on successful sign-in', async () => {
		const { user, passwordBeforeHash } = await makeUser()

		const res = await request(app.server).post('/auth/sign-in').send({
			email: user.email,
			password: passwordBeforeHash,
		})

		expect(res.status).toBe(HTTP_STATUS.NO_CONTENT)
		expect(res.headers['set-cookie'][0]).toMatch(TOKEN_COOKIE_REGEX)
	})
})
