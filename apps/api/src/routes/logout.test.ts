import request from 'supertest'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

import { app } from '../app.ts'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { createToken } from '../utils/jwt.ts'

describe('POST /auth/logout', async () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	test('should return HTTP 204 on successful logout', async () => {
		const validToken = createToken({ sub: 'some-valid-user-id' })

		const res = await request(app.server)
			.post('/auth/logout')
			.send()
			.set('Cookie', [`token=${validToken}`])

		expect(res.status).toEqual(HTTP_STATUS.NO_CONTENT)
		expect(res.headers['set-cookie'][0]).toBe(
			'token=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
		)
	})
})
