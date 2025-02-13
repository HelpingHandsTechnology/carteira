import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import { env } from "@/lib/env"

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})
console.log({allServerEnv: env})
export const _db = drizzle(pool, { schema })

export * from "./schema"

export type DbType = typeof _db
export type Schema = typeof schema
