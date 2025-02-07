import { Elysia, t } from 'elysia'
import { posts } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { db } from '../db'

export const postRouter = new Elysia({ prefix: '/posts' })
  .get('', async () => {
    console.log('get posts')
    console.log('recentPost',)
    try {
      const [recentPost] = await db
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(1)

      return recentPost ?? null
    } catch (error) {
      console.error('Error fetching recent post:', error)
      throw new Error('Failed to fetch recent post')
    }
  })
  .post('', async ({ body }) => {
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
