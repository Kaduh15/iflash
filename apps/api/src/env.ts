import z from "zod";

const DEFAULT_PORT = 3333 as const;

export const envSchema = z
	.object({
		PORT: z.coerce.number().default(DEFAULT_PORT),
		HOST: z.string().default("0.0.0.0"),
		DATABASE_URL: z.url(),
	})

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
