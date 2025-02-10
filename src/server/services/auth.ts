import { eq } from "drizzle-orm"
import { DbService } from "./db"
import { createHash, randomBytes } from "node:crypto"
import { Result, ResultAsync, err, ok, okAsync, errAsync } from "neverthrow"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../constants"
import { User, UserSelect } from "../db"

export type AuthResponse = {
  user: User
  token: string
}

export type AuthError =
  | { type: "INVALID_CREDENTIALS"; message: string }
  | { type: "USER_NOT_FOUND"; message: string }
  | { type: "EMAIL_ALREADY_EXISTS"; message: string }
  | { type: "DATABASE_ERROR"; message: string }
  | { type: "UNAUTHORIZED"; message: string }

class AuthService {
  constructor(private db: typeof DbService.db) {}

  verifyToken(token: string): ResultAsync<{ userId: string }, AuthError> {
    return ResultAsync.fromPromise(
      Promise.resolve().then(() => {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
          return decoded
        } catch (error) {
          throw { type: "UNAUTHORIZED" as const, message: "Token inválido" }
        }
      }),
      (error) => error as AuthError
    )
  }

  me(userId: User["id"]): ResultAsync<User, AuthError> {
    return ResultAsync.fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.id, userId),
      }),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Não foi possível encontrar o usuário",
      })
    )
      .andThen((user) => {
        if (!user) {
          return errAsync({
            type: "UNAUTHORIZED" as const,
            message: "Usuário não encontrado",
          })
        }
        return okAsync(user)
      })
      .map(this.mapToUser)
  }

  signUp(data: { email: string; password: string; name: string }): ResultAsync<AuthResponse, AuthError> {
    return this.checkExistingUser(data.email)
      .andThen(this.validateNewUser)
      .andThen(() =>
        ResultAsync.fromPromise(
          Promise.resolve(
            this.hashPassword(data.password).match(
              (value) => value,
              (error) => Promise.reject(error)
            )
          ),
          (e) => e as AuthError
        )
      )
      .andThen((hashedPassword) =>
        this.createUser({
          ...data,
          hashedPassword,
        })
      )
      .map((user) => ({
        user,
        token: this.generateToken(user),
      }))
  }

  signIn(data: { email: string; password: string }): ResultAsync<AuthResponse, AuthError> {
    return this.findUserByEmail(data.email)
      .andThen((user) => this.validatePassword(user, data.password))
      .map(this.mapToUser)
      .map((user) => ({
        user,
        token: this.generateToken(user),
      }))
  }

  private generateToken(user: User): string {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })
  }

  private checkExistingUser(email: string): ResultAsync<UserSelect | undefined, AuthError> {
    return ResultAsync.fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.email, email),
      }),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Não foi possível verificar o email",
      })
    )
  }

  private validateNewUser(user: UserSelect | undefined): ResultAsync<void, AuthError> {
    if (user) {
      return errAsync({
        type: "EMAIL_ALREADY_EXISTS" as const,
        message: "O email já está em uso",
      })
    }
    return okAsync(undefined)
  }

  private hashPassword(password: string): Result<string, AuthError> {
    try {
      const salt = randomBytes(16).toString("hex")
      const hash = createHash("sha256")
        .update(salt + password)
        .digest("hex")
      return ok(`${salt}:${hash}`)
    } catch (error) {
      return err({
        type: "DATABASE_ERROR" as const,
        message: "Email ou senha inválidos",
      })
    }
  }

  private createUser(data: {
    email: string
    password: string
    name: string
    hashedPassword: string
  }): ResultAsync<User, AuthError> {
    return ResultAsync.fromPromise(
      this.db
        .insert(User)
        .values({
          email: data.email,
          password: data.hashedPassword,
          name: data.name,
        })
        .returning(),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Não foi possível criar o usuário",
      })
    ).andThen((users) => {
      const user = users[0]
      if (!user) {
        return errAsync({
          type: "DATABASE_ERROR" as const,
          message: "Não foi possível criar o usuário",
        })
      }
      return okAsync(this.mapToUser(user))
    })
  }

  private findUserByEmail(email: string): ResultAsync<UserSelect, AuthError> {
    return ResultAsync.fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.email, email),
      }),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Não foi possível encontrar o usuário",
      })
    ).andThen((user) => {
      if (!user) {
        return errAsync({
          type: "USER_NOT_FOUND" as const,
          message: "Email ou senha inválidos",
        })
      }
      return okAsync(user)
    })
  }

  private validatePassword(user: UserSelect, password: string): ResultAsync<UserSelect, AuthError> {
    return okAsync(this.verifyPassword(user.password, password)).andThen((isValid) => {
      if (isValid.isErr()) {
        return errAsync({
          type: "INVALID_CREDENTIALS" as const,
          message: "Email ou senha inválidos",
        })
      }
      return okAsync(user)
    })
  }

  private verifyPassword(storedHash: string, password: string): Result<boolean, AuthError> {
    try {
      const [salt, hash] = storedHash.split(":")
      if (!salt || !hash) {
        return err({
          type: "INVALID_CREDENTIALS" as const,
          message: "Email ou senha inválidos",
        })
      }

      const newHash = createHash("sha256")
        .update(salt + password)
        .digest("hex")
      if (hash === newHash) {
        return ok(true)
      }
      return err({
        type: "INVALID_CREDENTIALS" as const,
        message: "Email ou senha inválidos",
      })
    } catch (error) {
      return err({
        type: "DATABASE_ERROR" as const,
        message: "Email ou senha inválidos",
      })
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

export const authService = new AuthService(DbService.db)
