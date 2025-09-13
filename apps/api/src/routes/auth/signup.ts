import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import z from "zod";

import { createUser } from "../../db/functions/create-user.ts";
import { getUserByEmail } from "../../db/functions/get-user-by-email.ts";
import { hash } from "../../utils/crypt.ts";
import { HTTP_STATUS } from "../../utils/https-status.ts";
import { createToken } from "../../utils/jwt.ts";

const PASSWORD_MIN_LENGTH = 8 as const;

export const authSignupRouter: FastifyPluginCallbackZod = (app) => {
	app.post(
		"/auth/signup",
		{
			schema: {
				tags: ["Auth"],
				body: z.object({
					name: z.string().describe("Nome do usuário"),
					email: z.email().describe("Email do usuário"),
					password: z
						.string()
						.min(PASSWORD_MIN_LENGTH, "Senhe Precisa ter 8 caracteres")
						.describe("Senha do usuário"),
				}),
				response: {
					[HTTP_STATUS.CREATED]: z
						.null()
						.describe("Usuário criado com sucesso!"),
					[HTTP_STATUS.CONFLICT]: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, name, password } = request.body;

			const hasUser = await getUserByEmail(email);

			if (hasUser) {
				return reply.status(HTTP_STATUS.CONFLICT).send({
					message: "Email ou senha invalidos",
				});
			}

			const passwordHash = await hash(password);

			const user = await createUser({ email, name, password: passwordHash });

			const token = createToken({
				sub: user.id,
			});

			return reply.setCookie("token", token).status(HTTP_STATUS.CREATED).send();
		}
	);
};
