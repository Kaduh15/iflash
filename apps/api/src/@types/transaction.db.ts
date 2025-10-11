import type { db } from '../db/index.ts'

export type DatabaseTransaction = Parameters<
	Parameters<typeof db.transaction>[0]
>[0]
