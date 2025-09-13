import { hash as argon2Hash } from "argon2";

export async function hash(input: string) {
	const data = await argon2Hash(input);

	return data;
}
