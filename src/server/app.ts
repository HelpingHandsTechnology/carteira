import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { prettyJSON } from "hono/pretty-json"
import { authRouter } from "./routers/auth-router"
import { loggerMiddleware } from "./middlewares/logger"

const app = new Hono()
  .basePath("/api")
  .use("*", cors())
  .use("*", logger())
  .use("*", prettyJSON())
  .use("*", loggerMiddleware)
  .route("/auth", authRouter)

export { app }
