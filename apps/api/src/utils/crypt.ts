import { hash as argon2Hash, verify as argon2Verify } from "argon2"

export async function hash(input: string) {
	const data = await argon2Hash(input)

	return data
}

export async function verifyHash({
	passwordHash,
	password,
}: {
	passwordHash: string
	password: string
}) {
	const data = await argon2Verify(passwordHash, password)

	return data
}
