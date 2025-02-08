import { Elysia, t } from 'elysia'
import { posts } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { DbService } from '@/server/services/db'

export const postRouter = new Elysia({ prefix: '/posts' })
  .decorate('db', DbService.db)
  .get('', async ({ db }) => {
    const [recentPost] = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(1)

    return recentPost ?? null
  })
  .post('', async ({ body, db }) => {
    const post = await db
      .insert(posts)
      .values({ name: body.name })
      .returning()

    return post[0]
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 })
    })
  })
