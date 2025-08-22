import z from "zod";

export const envSchema = z.
  object({
    PORT: z.coerce
      .number()
      .default(3333),
    HOST: z.string().default('0.0.0.0')
  });

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);