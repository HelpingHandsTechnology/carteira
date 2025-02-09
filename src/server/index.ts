import { Elysia } from "elysia"
import { postRouter } from "./routers/post-router"
import { authRouter } from "./routers/auth-router"
import { logger, loggerMiddleware } from "./middlewares/logger"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 */
export const app = new Elysia({ prefix: "/api" })
  .onError(({ error, set, request }) => {
    logger.error({
      message: error instanceof Error ? error.message : "Unknown error",
      path: new URL(request.url).pathname,
      stack: error instanceof Error ? error.stack : undefined,
    })
    set.status = 500
    return { error: { message: "Internal Server Error" } }
  })
  .use(loggerMiddleware)
  .use(postRouter)
  .use(authRouter)

export type AppType = typeof app
export default app
