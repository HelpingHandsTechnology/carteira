import { eq } from "drizzle-orm"
import { DbService } from "./db"
import { SelectUser, User } from "../db/schema"
import { createHash, randomBytes } from "node:crypto"
import { Result, ResultAsync, err, ok, okAsync, errAsync } from "neverthrow"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../constants"

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

export class AuthService {
  constructor(private db: typeof DbService.db) {}

  verifyToken(token: string): ResultAsync<{ userId: number }, AuthError> {
    return ResultAsync.fromPromise(
      Promise.resolve().then(() => {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
          return decoded
        } catch (error) {
          throw { type: "UNAUTHORIZED" as const, message: "Token inválido" }
        }
      }),
      (error) => error as AuthError
    )
  }

  me(userId: number): ResultAsync<User, AuthError> {
    return ResultAsync.fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.id, userId),
      }),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Failed to find user",
      })
    ).andThen((user) => {
      if (!user) {
        return errAsync({
          type: "UNAUTHORIZED" as const,
          message: "Unauthorized",
        })
      }
      return okAsync(this.mapToUser(user))
    })
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

  private checkExistingUser(email: string): ResultAsync<SelectUser | undefined, AuthError> {
    return ResultAsync.fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.email, email),
      }),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Failed to check email",
      })
    )
  }

  private validateNewUser(user: SelectUser | undefined): ResultAsync<void, AuthError> {
    if (user) {
      return errAsync({
        type: "EMAIL_ALREADY_EXISTS" as const,
        message: "Email already in use",
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
        message: "Failed to hash password",
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
        message: "Failed to create user",
      })
    ).andThen((users) => {
      const user = users[0]
      if (!user) {
        return errAsync({
          type: "DATABASE_ERROR" as const,
          message: "Failed to create user",
        })
      }
      return okAsync(this.mapToUser(user))
    })
  }

  private findUserByEmail(email: string): ResultAsync<SelectUser, AuthError> {
    return ResultAsync.fromPromise(
      this.db.query.User.findFirst({
        where: eq(User.email, email),
      }),
      () => ({
        type: "DATABASE_ERROR" as const,
        message: "Failed to find user",
      })
    ).andThen((user) => {
      if (!user) {
        return errAsync({
          type: "USER_NOT_FOUND" as const,
          message: "User not found",
        })
      }
      return okAsync(user)
    })
  }

  private validatePassword(user: SelectUser, password: string): ResultAsync<SelectUser, AuthError> {
    return okAsync(this.verifyPassword(user.password, password)).andThen((isValid) => {
      if (!isValid) {
        return errAsync({
          type: "INVALID_CREDENTIALS" as const,
          message: "Invalid password",
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
          message: "Invalid password format",
        })
      }

      const newHash = createHash("sha256")
        .update(salt + password)
        .digest("hex")
      return ok(hash === newHash)
    } catch (error) {
      return err({
        type: "DATABASE_ERROR" as const,
        message: "Failed to verify password",
      })
    }
  }

  private mapToUser(user: SelectUser): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}
