import { config } from 'dotenv'
import { z } from "zod";

config()

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('prod'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333)
})

const _env = envSchema.parse(process.env)

export const env = _env