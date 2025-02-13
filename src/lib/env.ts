import { z } from "zod"

const _env = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]),
})

export const env = _env.parse(process.env)
