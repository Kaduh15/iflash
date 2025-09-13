import { app } from "./app.ts"
import { env } from "./env.ts"

const start = async () => {
	try {
		await app.listen({ port: env.PORT, host: env.HOST })
	} catch (err) {
		console.error(err)
		process.exit(1)
	}
}

await start()
