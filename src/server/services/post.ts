import { type DbType } from '@/server/db'
import { posts } from '@/server/db/schema'
import { BaseService, type BaseEntity } from './base'
import { eq } from 'drizzle-orm'

interface Post extends BaseEntity {
  name: string
}

export class PostService extends BaseService<Post> {
  constructor(db: DbType) {
    super(db, posts)
  }

  async findByName(name: string): Promise<Post | null> {
    const [result] = await this.db
      .select()
      .from(posts)
      .where(eq(posts.name, name))
      .limit(1)

    return result || null
  }
} 