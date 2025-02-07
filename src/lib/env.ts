import { z } from 'zod'

const _env = z.object({
  DATABASE_URL: z.string().url(),
})

export const env = _env.parse(process.env)

