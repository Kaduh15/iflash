import type { FastifyReply, FastifyRequest } from 'fastify'
import { HTTP_STATUS } from '../../constants/https-status.ts'
import { verifyToken } from '../../utils/jwt.ts'

// biome-ignore lint/suspicious/useAwait: <>
export async function checkTokenRequest(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const { token } = request.cookies

	if (!token) {
		reply.status(HTTP_STATUS.UNAUTHORIZED).send()
		return
	}

	try {
		const payload = verifyToken(token)

		request.user = payload
	} catch {
		reply.status(HTTP_STATUS.UNAUTHORIZED).send()
		return
	}
}
