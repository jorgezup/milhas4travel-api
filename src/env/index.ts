import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.number().default(3000),
  MONGO_HOST: z.string(),
  MONGO_PORT: z.string(),
  MONGO_DATABASE: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
