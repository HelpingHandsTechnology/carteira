import { Elysia } from "elysia"
import { postRouter } from "./routers/post-router"
import { authRouter } from "./routers/auth-router"
import { logger, loggerMiddleware } from "./middlewares/logger"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 */
export const app = new Elysia({ prefix: "/api" })
  .onError((ctx) => {
    logger.error({
      message: ctx.error instanceof Error ? ctx.error.message : "Unknown error",
      path: new URL(ctx.request.url).pathname,
      stack: ctx.error instanceof Error ? ctx.error.stack : undefined,
    })
    ctx.set.status = 500
    return { error: { message: "Internal Server Error" } }
  })
  .use(loggerMiddleware)
  .use(postRouter)
  .use(authRouter)

export type AppType = typeof app
export default app
