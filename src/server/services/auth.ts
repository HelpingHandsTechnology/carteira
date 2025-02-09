import { eq } from "drizzle-orm"
import { DbService } from "./db"
import { Users } from "../db/schema"
import { createHash, randomBytes } from "node:crypto"

export class AuthService {
  constructor(private db: typeof DbService.db) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex")
    const hash = createHash("sha256")
      .update(salt + password)
      .digest("hex")
    return `${salt}:${hash}`
  }

  private async verifyPassword(storedHash: string, password: string): Promise<boolean> {
    const [salt, hash] = storedHash.split(":")
    if (!salt || !hash) return false

    const newHash = createHash("sha256")
      .update(salt + password)
      .digest("hex")
    return hash === newHash
  }

  async signUp(data: { email: string; password: string; name: string }) {
    const hashedPassword = await this.hashPassword(data.password)

    const user = await this.db
      .insert(Users)
      .values({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      })
      .returning()

    return user[0]
  }

  async signIn(data: { email: string; password: string }) {
    const user = await this.db.query.Users.findFirst({
      where: eq(Users.email, data.email),
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    const validPassword = await this.verifyPassword(user.password, data.password)

    if (!validPassword) {
      throw new Error("Invalid credentials")
    }

    return user
  }
}
