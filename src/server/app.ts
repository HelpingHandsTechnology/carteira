import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { authRouter } from "./routers/auth-router"
import { accountsRouter } from "./routers/accounts-router"
import { loggerMiddleware } from "./middlewares/logger"
import { HTTPException } from "hono/http-exception"

const app = new Hono()
  .basePath("/api")
  .use("*", cors())
  .use("*", prettyJSON())
  .use("*", loggerMiddleware)
  .route("/auth", authRouter)
  .route("/accounts", accountsRouter)

export type AppType = typeof app

export { app }
