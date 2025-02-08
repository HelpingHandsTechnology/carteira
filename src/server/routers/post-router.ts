import { Elysia, t } from 'elysia'
import { posts } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { DbService } from '@/server/services/db'
import { PostService } from '@/server/services/post'

export class PostModel {
  static id = t.Object({
    id: t.String()
  })

  static create = t.Object({
    name: t.String({ minLength: 1 })
  })

  static update = {
    params: this.id,
    body: this.create
  }

  static delete = {
    params: this.id
  }
}

export const postRouter = new Elysia({ prefix: '/posts' })
  .decorate('postService', new PostService(DbService.db))
  .get('', async ({ postService }) => {
    const [recentPost] = await postService.findMany()
    return recentPost ?? null
  })
  .get('/:id', async ({ params: { id }, postService }) => {
    const post = await postService.findById(Number(id))
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  }, {
    params: PostModel.id
  })
  .post('', async ({ body, postService }) => {
    const post = await postService.create({ name: body.name })
    return post
  }, {
    body: PostModel.create
  })
  .put('/:id', async ({ params: { id }, body, postService }) => {
    const post = await postService.update(Number(id), { name: body.name })
    return post
  }, PostModel.update)
  .delete('/:id', async ({ params: { id }, postService }) => {
    const post = await postService.delete(Number(id))
    return post
  }, PostModel.delete)
