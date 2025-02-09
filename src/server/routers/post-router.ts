import { Elysia, t } from "elysia"
import { Posts } from "@/server/db/schema"
import { desc } from "drizzle-orm"
import { DbService } from "@/server/services/db"
import { PostService } from "@/server/services/post"

export class PostModel {
  static id = t.Object({
    id: t.String(),
  })

  static create = t.Object({
    name: t.String({ minLength: 1 }),
  })

  static update = {
    params: this.id,
    body: this.create,
  }

  static delete = {
    params: this.id,
  }
}

export const postRouter = new Elysia({ prefix: "/posts" })
  .decorate("postService", new PostService(DbService.db))
  .get("", async ({ postService }) => {
    const [recentPost] = await postService.findMany()
    return recentPost ?? null
  })
