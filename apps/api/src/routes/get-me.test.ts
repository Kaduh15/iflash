import request from 'supertest'
import { describe, expect, test } from 'vitest'

import { app } from '../app.ts'
import { HTTP_STATUS } from '../constants/https-status.ts'
import { makeUser } from '../tests/factories/make-user.ts'
import { createToken } from '../utils/jwt.ts'

describe('GET /me', () => {
	test('should return authenticated user data', async () => {
		await app.ready()

		const { user } = await makeUser()

		const token = createToken({
			sub: user.id,
		})

		const response = await request(app.server)
			.get('/me')
			.set('Cookie', [`token=${token}`])

		expect(response.status).toBe(HTTP_STATUS.OK)
		expect(response.body).toEqual({
			user: {
				id: expect.any(String),
				name: expect.any(String),
				email: expect.any(String),
				lastLoginAt: null,
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			},
		})
	})
})
