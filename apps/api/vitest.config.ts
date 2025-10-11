import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		globals: true,
		include: ['src/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			exclude: [
				'**/tests/**',
				'**/*.d.ts',
				'**/index.ts',
				'**/server.ts',
				'**/app.ts',
				'**/drizzle.config.ts',
				'**/vitest.config.ts',
			],
		},
	},
})
