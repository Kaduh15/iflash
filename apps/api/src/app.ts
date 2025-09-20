import cookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifyScaler from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { env } from './env.ts'
import { bootRouter } from './routes/boot.ts'
import { getMe } from './routes/get-me.ts'
import { authLogoutRouter } from './routes/logout.ts'
import { authSignInRouter } from './routes/sign-in.ts'
import { authSignUpRouter } from './routes/sign-up.ts'

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const DAYS_PER_WEEK = 7
const ONE_WEEK_SECONDS =
	SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK

const app = fastify({
	logger: env.NODE_ENV !== 'test' && {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	},
}).withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
	origin: 'http://localhost:5173',
})

app.register(cookie, {
	secret: env.COOKIE_SECRET,
	hook: 'onRequest',
	parseOptions: {
		path: '/',
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		maxAge: ONE_WEEK_SECONDS,
		sameSite: 'strict',
	},
})

await app.register(fastifySwagger, {
	openapi: {
		openapi: '3.0.0',
		info: {
			title: 'Test swagger',
			description: 'Testing the Fastify swagger API',
			version: '0.1.0',
		},
	},
	transform: jsonSchemaTransform,
})

await app.register(fastifyScaler, {
	routePrefix: '/docs',
	configuration: {
		theme: 'kepler',
	},
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get(
	'/health',
	{
		schema: {
			tags: ['Health'],
			response: {
				200: z.string().default('ok'),
			},
		},
	},
	() => {
		return 'ok'
	}
)

app.register(authSignUpRouter)
app.register(authSignInRouter)
app.register(authLogoutRouter)
app.register(getMe)
app.register(bootRouter)

export { app }
