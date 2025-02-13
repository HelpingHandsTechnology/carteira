import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import { env } from "@/lib/env"

console.log(env.DATABASE_URL)
const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const _db = drizzle(pool, { schema })

export * from "./schema"

export type DbType = typeof _db
export type Schema = typeof schema
