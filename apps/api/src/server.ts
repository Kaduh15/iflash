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

app.get(
	"/health",
	() => {
		return "ok";
	}
);

const start = async () => {
	try {
		await app.listen({ port: env.PORT, host: env.HOST });
		console.info(`✅ server on http://${env.HOST}:${env.PORT}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

await start();
