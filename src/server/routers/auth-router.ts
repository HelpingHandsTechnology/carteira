import { Elysia, error, t } from "elysia"
import { AuthService } from "../services/auth"
import { DbService } from "../services/db"
import type { AuthError } from "../services/auth"
import { match } from "ts-pattern"
import { COOKIE_KEYS, COOKIE_CONFIG } from "../constants"

export class AuthModel {
  static signUp = t.Object({
    email: t.String({ format: "email", error: "Invalid email format" }),
    password: t.String({ minLength: 6, error: "Password must be at least 6 characters long" }),
    name: t.String({ minLength: 2, error: "Name must be at least 2 characters long" }),
  })

  static signIn = t.Object({
    email: t.String({ format: "email", error: "Invalid email format" }),
    password: t.String({ minLength: 1, error: "Password is required" }),
  })
}

const getErrorResponse = (error: AuthError) => {
  return match(error)
    .with({ type: "INVALID_CREDENTIALS" }, () => ({ status: 401, message: error.message }))
    .with({ type: "USER_NOT_FOUND" }, () => ({ status: 404, message: error.message }))
    .with({ type: "EMAIL_ALREADY_EXISTS" }, () => ({ status: 409, message: error.message }))
    .with({ type: "DATABASE_ERROR" }, () => ({ status: 500, message: "Internal server error" }))
    .with({ type: "UNAUTHORIZED" }, () => ({ status: 401, message: error.message }))
    .exhaustive()
}

export const authRouter = new Elysia({ prefix: "/auth" })
  .decorate("authService", new AuthService(DbService.db))
  .get("/me", async (ctx) => {
    const { userId } = ctx.cookie

    if (!userId) {
      return ctx.error(401, { message: "Unauthorized" })
    }

    const result = await ctx.authService.me(Number(userId))

    if (result.isErr()) {
      const { status, message } = getErrorResponse(result.error)
      ctx.set.status = status
      return ctx.error(status, { message })
    }

    return result.value
  })
  .get("/verify", async (ctx) => {
    const token = ctx.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      ctx.set.status = 401
      return ctx.error(401, { message: "Token não fornecido" })
    }

    const result = await ctx.authService.verifyToken(token)

    if (result.isErr()) {
      const { status, message } = getErrorResponse(result.error)
      ctx.set.status = status
      return ctx.error(status, { message })
    }

    const userResult = await ctx.authService.me(result.value.userId)

    if (userResult.isErr()) {
      const { status, message } = getErrorResponse(userResult.error)
      ctx.set.status = status
      return ctx.error(status, { message })
    }

    return {
      success: true,
      data: {
        user: userResult.value,
        userId: result.value.userId,
      },
    }
  })
  .post(
    "/signup",
    async (ctx) => {
      const result = await ctx.authService.signUp(ctx.body)

      if (result.isErr()) {
        const { status, message } = getErrorResponse(result.error)
        ctx.set.status = status
        return ctx.error(status, { message })
      }

      ctx.cookie[COOKIE_KEYS.userId]?.set({
        value: String(result.value.user.id),
        ...COOKIE_CONFIG,
      })

      ctx.cookie[COOKIE_KEYS.token]?.set({
        value: result.value.token,
        ...COOKIE_CONFIG,
      })

      return {
        success: true,
        data: result.value,
      }
    },
    {
      body: AuthModel.signUp,
    }
  )
  .post(
    "/signin",
    async (ctx) => {
      const result = await ctx.authService.signIn(ctx.body)

      if (result.isErr()) {
        const { status, message } = getErrorResponse(result.error)
        ctx.set.status = status
        return ctx.error(status, { message })
      }

      ctx.cookie[COOKIE_KEYS.userId]?.set({
        value: String(result.value.user.id),
        ...COOKIE_CONFIG,
      })
      ctx.cookie[COOKIE_KEYS.token]?.set({
        value: result.value.token,
        ...COOKIE_CONFIG,
      })

      return {
        success: true,
        data: result.value,
      }
    },
    {
      body: AuthModel.signIn,
    }
  )
  .post("/logout", async (ctx) => {
    ctx.cookie[COOKIE_KEYS.userId]?.remove()
    ctx.cookie[COOKIE_KEYS.token]?.remove()

    return {
      success: true,
      data: null,
    }
  })
