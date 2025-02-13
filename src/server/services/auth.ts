import { AppResult, err, fromPromise, ok } from "@/lib/gots"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"
import { createHash, randomBytes } from "node:crypto"
import { JWT_SECRET } from "../constants"
import { User, UserSelect } from "../db"
import { DbService } from "./db"

export type AuthResponse = {
  user: User
  token: string
}

export type AuthError =
  | { type: "INVALID_CREDENTIALS"; message: string; cause?: unknown }
  | { type: "USER_NOT_FOUND"; message: string; cause?: unknown }
  | { type: "EMAIL_ALREADY_EXISTS"; message: string; cause?: unknown }
  | { type: "DATABASE_ERROR"; message: string; cause?: unknown }
  | { type: "UNAUTHORIZED"; message: string; cause?: unknown }

export class AuthService {
  constructor(private db: typeof DbService.db) {}

  static async verifyToken(token: string): Promise<AppResult<{ userId: string }, AuthError>> {
    return fromPromise(
      Promise.resolve().then(() => {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        return decoded
      }),
      (): AuthError => ({ type: "UNAUTHORIZED", message: "Token inválido" })
    )
  }

  async me(userId: User["id"]): Promise<AppResult<User, AuthError>> {
    const user = await this.db.query.User.findFirst({
      where: eq(User.id, userId),
    })

    if (!user) {
      return err({
        type: "UNAUTHORIZED",
        message: "Usuário não encontrado",
      } as const)
    }

    return ok(this.mapToUser(user))
  }

  async signUp(data: { email: string; password: string; name: string }): Promise<AppResult<AuthResponse, AuthError>> {
    const [existingUser, existingUserError] = await this.checkExistingUser(data.email)

    if (existingUserError) {
      return err(existingUserError)
    }

    if (existingUser) {
      return err({
        type: "EMAIL_ALREADY_EXISTS",
        message: "O email já está em uso",
      } as const)
    }

    const [hashedPassword, hashError] = this.hashPassword(data.password)
    if (hashError) {
      return err(hashError)
    }

    const [user, createError] = await this.createUser({
      ...data,
      hashedPassword,
    })

    if (createError) {
      return err(createError)
    }

    return ok({
      user,
      token: this.generateToken(user),
    })
  }

  async signIn(data: { email: string; password: string }): Promise<AppResult<AuthResponse, AuthError>> {
    const [user, userError] = await this.findUserByEmail(data.email)
    if (userError) {
      return err(userError)
    }

    const [isValid, validationError] = this.verifyPassword(user.password, data.password)
    if (validationError) {
      return err({
        type: "INVALID_CREDENTIALS",
        message: "Email ou senha inválidos",
      } as const)
    }

    if (!isValid) {
      return err({
        type: "INVALID_CREDENTIALS",
        message: "Email ou senha inválidos",
      } as const)
    }

    const mappedUser = this.mapToUser(user)
    return ok({
      user: mappedUser,
      token: this.generateToken(mappedUser),
    })
  }

  private generateToken(user: User): string {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })
  }

  private async checkExistingUser(email: string): Promise<AppResult<UserSelect | undefined, AuthError>> {
    return fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.email, email),
      }),
      (error): AuthError => ({
        type: "DATABASE_ERROR",
        message: "Não foi possível verificar o email",
        cause: error,
      })
    )
  }

  private hashPassword(password: string): AppResult<string, AuthError> {
    try {
      const salt = randomBytes(16).toString("hex")
      const hash = createHash("sha256")
        .update(salt + password)
        .digest("hex")
      return ok(`${salt}:${hash}`)
    } catch (error) {
      return err({
        type: "DATABASE_ERROR",
        message: "Email ou senha inválidos",
      } as const)
    }
  }

  private async createUser(data: {
    email: string
    password: string
    name: string
    hashedPassword: string
  }): Promise<AppResult<User, AuthError>> {
    const [users, createError] = await fromPromise(
      this.db
        .insert(User)
        .values({
          email: data.email,
          password: data.hashedPassword,
          name: data.name,
        })
        .returning(),
      (): AuthError => ({
        type: "DATABASE_ERROR",
        message: "Não foi possível criar o usuário",
      })
    )

    if (createError) {
      return err(createError)
    }

    const user = users[0]
    if (!user) {
      return err({
        type: "DATABASE_ERROR",
        message: "Não foi possível criar o usuário",
      } as const)
    }

    return ok(this.mapToUser(user))
  }

  private async findUserByEmail(email: string): Promise<AppResult<UserSelect, AuthError>> {
    const [user, error] = await fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.email, email),
      }),
      (error): AuthError => ({
        type: "DATABASE_ERROR",
        message: "Não foi possível encontrar o usuário",
        cause: error,
      })
    )

    if (error) {
      return err(error)
    }

    if (!user) {
      return err({
        type: "USER_NOT_FOUND",
        message: "Email ou senha inválidos",
      } as const)
    }

    return ok(user)
  }

  private verifyPassword(storedHash: string, password: string): AppResult<boolean, AuthError> {
    try {
      const [salt, hash] = storedHash.split(":")
      if (!salt || !hash) {
        return err({
          type: "INVALID_CREDENTIALS",
          message: "Email ou senha inválidos",
        } as const)
      }

      const newHash = createHash("sha256")
        .update(salt + password)
        .digest("hex")

      return ok(hash === newHash)
    } catch (error) {
      return err({
        type: "DATABASE_ERROR",
        message: "Email ou senha inválidos",
      } as const)
    }
  }

  private mapToUser(user: UserSelect): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}
