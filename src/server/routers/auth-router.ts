import { Elysia, error, t } from "elysia"
import { AuthService } from "../services/auth"
import { DbService } from "../services/db"
import type { AuthError } from "../services/auth"
import { match } from "ts-pattern"
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
    .exhaustive()
}

export const authRouter = new Elysia({ prefix: "/auth" })
  .decorate("authService", new AuthService(DbService.db))
  .post(
    "/signup",
    async (ctx) => {
      const result = await ctx.authService.signUp(ctx.body)

      if (result.isErr()) {
        const { status, message } = getErrorResponse(result.error)
        ctx.set.status = status
        return ctx.error(status, { message })
      }

      console.log(result.value)
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

      return {
        success: true,
        data: result.value,
      }
    },
    {
      body: AuthModel.signIn,
    }
  )
