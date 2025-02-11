import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function recreateDatabase() {
  const connectionString = process.env.TEST_DATABASE_URL

  const pool = new Pool({ connectionString })
  const db = drizzle(pool)

  try {
    // Clear existing database
    await db.execute("DROP SCHEMA IF EXISTS public CASCADE;")
    await db.execute("DROP SCHEMA IF EXISTS drizzle CASCADE;")
    await db.execute("CREATE SCHEMA public;")
    await execAsync(
      `npx drizzle-kit push --url=${connectionString} --dialect=postgresql --schema=./src/server/db/schema.ts`
    )
  } finally {
    await db.$client.end()
  }
}
