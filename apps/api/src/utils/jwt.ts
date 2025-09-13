import jwt from 'jsonwebtoken'
import { env } from '../env.ts'

export function createToken(payload: jwt.JwtPayload) {
	return jwt.sign(payload, env.JWT_SECRET)
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, env.JWT_SECRET)
	} catch {
		throw new Error('token jwt invalido!')
	}
}
