import { Elysia } from 'elysia'
import { postRouter } from './routers/post-router'
import { logger } from './middlewares/logger'

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 */
export const app = new Elysia({ prefix: '/api' })
  .use(logger)
  .onError(({ error, set }) => {
    if (error instanceof Error) {
      set.status = 500
      return { error: { message: error.message } }
    }
    set.status = 500
    return { error: { message: 'Internal Server Error' } }
  })
  .use(postRouter)

export type AppType = typeof app
export default app
