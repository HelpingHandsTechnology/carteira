import { AppError } from "@/lib/errors"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { DbType } from "./db"
import { loggerMiddleware } from "./middlewares/logger"
import { accountsRouter } from "./routers/accounts-router"
import { authRouter } from "./routers/auth-router"
import { AuthService } from "./services/auth"
import { DbService } from "./services/db"

export type AppDeps = {
  authService: AuthService
  db: DbType
}

export const appWithoutDeps = new Hono<{ Variables: AppDeps }>()
  .use("*", (c, next) => {
    const checkDeps: (keyof AppDeps)[] = ["authService"]
    checkDeps.forEach((dep) => {
      if (!c.get(dep)) {
        throw new AppError(500, { message: `${dep} not found` })
      }
    })
    return next()
  })
  .basePath("/api")
  .use("*", cors())
  .use("*", prettyJSON())
  .use("*", loggerMiddleware)
  .route("/auth", authRouter)
  .route("/accounts", accountsRouter)

const app = new Hono<{ Variables: AppDeps }>()
  .use("*", (c, next) => {
    c.set("db", DbService.db)
    c.set("authService", new AuthService(DbService.db))
    return next()
  })
  .route("/", appWithoutDeps)
export type AppType = typeof app


export { app }
