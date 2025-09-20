import { Redis } from 'ioredis'
import { env } from '../env.ts'

const redis = new Redis(env.REDIS_URL)

export { redis }
