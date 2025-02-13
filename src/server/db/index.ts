import { env } from "@/lib/env"
import { PGlite } from "@electric-sql/pglite"
import { drizzle } from "drizzle-orm/node-postgres"
import { drizzle as drizzlePglite } from "drizzle-orm/pglite"
import { migrate } from "drizzle-orm/pglite/migrator"
import { Pool } from "pg"
import * as schema from "./schema"

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const createMemoryDb = async () => {
  const client = new PGlite()
  const db = drizzlePglite(client, { schema })

  await migrate(db, { migrationsFolder: "./drizzle" })
  return db
}
export const _db = drizzle(pool, { schema })

export * from "./schema"

export type DbType = typeof _db
export type Schema = typeof schema
