import 'fastify'
import type { JwtPayload } from 'jsonwebtoken'

declare module 'fastify' {
	export interface FastifyRequest {
		user?: string | JwtPayload
	}
}
