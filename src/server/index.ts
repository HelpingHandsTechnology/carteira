import { Elysia } from 'elysia'
import { postRouter } from './routers/post-router'

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 */
export const app = new Elysia({ prefix: '/api' })
  .use(postRouter)
  .onError(({ error, set }) => {
    if (error instanceof Error) {
      console.error(`[ERROR] ${error.message}`)
      set.status = 500
      return { error: { message: error.message } }
    }
    console.error(`[ERROR] ${error}`)
    set.status = 500
    return { error: { message: 'Internal Server Error' } }
  })

export type AppType = typeof app
export default app
