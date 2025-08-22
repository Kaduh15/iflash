import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "http://localhost:5173",
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/health", (_request, _reply) => {
	return "ok";
});

const start = async () => {
	try {
		await app.listen({ port: env.PORT, host: env.HOST });
		console.info(
			`Server listening on port ${env.PORT} at http://${env.HOST}:${env.PORT}`
		);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
