import { z } from 'zod'

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  API_PORT: z.string().transform(Number).default('8080'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  HOST: z.string().default('0.0.0.0'),
})

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

export function validateServerEnv() {
  const result = serverEnvSchema.safeParse(process.env)

  if (!result.success) {
    console.error('❌ Invalid server environment variables:')
    console.error(result.error.format())
    throw new Error('Invalid server environment variables')
  }

  return result.data
}

export function validateClientEnv() {
  const result = clientEnvSchema.safeParse(process.env)

  if (!result.success) {
    console.error('❌ Invalid client environment variables:')
    console.error(result.error.format())
    throw new Error('Invalid client environment variables')
  }

  return result.data
}
