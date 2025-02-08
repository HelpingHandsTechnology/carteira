import { type PgTable } from 'drizzle-orm/pg-core'
import { type DbType } from '@/server/db'
import { eq, type SQLWrapper } from 'drizzle-orm'

export interface BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date
}

export class BaseService<T extends BaseEntity> {
  constructor(
    protected readonly db: DbType,
    protected readonly table: PgTable<any>
  ) { }

  async findById(id: number): Promise<T | null> {
    const [result] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id as any, id))
      .limit(1)

    return result as T || null
  }

  async findMany(where?: SQLWrapper): Promise<T[]> {
    const query = this.db.select().from(this.table)
    if (where) {
      query.where(where)
    }
    return query as Promise<T[]>
  }

  async create(data: Omit<T, keyof BaseEntity>): Promise<T> {
    const [result] = await this.db
      .insert(this.table)
      .values(data as any)
      .returning()

    return result as T
  }

  async update(id: number, data: Partial<Omit<T, keyof BaseEntity>>): Promise<T> {
    const [result] = await this.db
      .update(this.table)
      .set({
        ...data,
        updatedAt: new Date()
      } as any)
      .where(eq(this.table.id as any, id))
      .returning()

    return result as T
  }

  async delete(id: number): Promise<T> {
    const [result] = await this.db
      .delete(this.table)
      .where(eq(this.table.id as any, id))
      .returning()

    return result as T
  }
} 