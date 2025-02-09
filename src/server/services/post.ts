import { type DbType } from "@/server/db"
import { Posts } from "@/server/db/schema"
import { eq } from "drizzle-orm"

interface Post {
  name: string
}

export class PostService {
  constructor(protected readonly db: DbType) {}

  async findByName(name: string): Promise<Post | null> {
    const [result] = await this.db.select().from(Posts).where(eq(Posts.name, name)).limit(1)

    return result || null
  }
  findMany() {
    return this.db.select().from(Posts)
  }
}
