import { AppDeps, appWithoutDeps } from "@/server/app"
import { createMemoryDb, DbType } from "@/server/db"
import { AuthService } from "@/server/services/auth"
import { createAdaptorServer, ServerType } from "@hono/node-server"
import { Hono } from "hono"
import { hc } from "hono/client"

export const getMockedDeps = async (): Promise<AppDeps> => {
  const memoryDb = await createMemoryDb()
  return {
    authService: new AuthService(memoryDb as unknown as DbType),
    db: memoryDb as unknown as DbType,
  }
}

const servers = new Set<ServerType>()
export async function createApp() {
  const port = Math.floor(Math.random() * 10000) + 3000

  let time = performance.now()
  const deps = await getMockedDeps()
  time = performance.now()
  const app = new Hono<{ Variables: AppDeps }>()
    .use("*", async (c, next) => {
      c.set("authService", deps.authService)
      c.set("db", deps.db)
      return next()
    })
    .route("/", appWithoutDeps)
  const rpc = hc<typeof app>("http://localhost:" + port)
  const server = createAdaptorServer({
    fetch: app.fetch,
    port,
  })

  server.listen(port)
  servers.add(server)
  return rpc
}
export type Rpc = Awaited<ReturnType<typeof createApp>>

export const cleanupServers = async () => {
  servers.forEach((server) => {
    server.close()
  })
}
