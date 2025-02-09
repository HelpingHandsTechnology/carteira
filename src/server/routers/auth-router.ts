import { Hono } from "hono"
import type { Context } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { AuthService } from "../services/auth"
import { DbService } from "../services/db"
import type { AuthError } from "../services/auth"
import { match } from "ts-pattern"
import { COOKIE_KEYS, COOKIE_CONFIG } from "../constants"
import { getCookie, setCookie } from "hono/cookie"
import { StatusCode } from "hono/utils/http-status"

export class AuthModel {
  static signUp = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  })

  static signIn = z.object({
    email: z.string().email("Formato de email inválido"),
    password: z.string().min(1, "A senha é obrigatória"),
  })
}

export type SignUpInput = z.infer<typeof AuthModel.signUp>
export type SignInInput = z.infer<typeof AuthModel.signIn>

const getErrorResponse = (error: AuthError) => {
  return match(error)
    .with({ type: "INVALID_CREDENTIALS" }, () => ({ status: 401 as StatusCode, message: error.message }))
    .with({ type: "USER_NOT_FOUND" }, () => ({ status: 404 as StatusCode, message: error.message }))
    .with({ type: "EMAIL_ALREADY_EXISTS" }, () => ({ status: 409 as StatusCode, message: error.message }))
    .with({ type: "DATABASE_ERROR" }, () => ({ status: 500 as StatusCode, message: "Internal server error" }))
    .with({ type: "UNAUTHORIZED" }, () => ({ status: 401 as StatusCode, message: error.message }))
    .exhaustive()
}

const authService = new AuthService(DbService.db)

export const authRouter = new Hono()
  .get("/me", async (c) => {
    const userId = getCookie(c, COOKIE_KEYS.userId)

    if (!userId) {
      c.status(401 as StatusCode)
      return c.json({ message: "Unauthorized" })
    }

    const result = await authService.me(Number(userId))

    if (result.isErr()) {
      const { status, message } = getErrorResponse(result.error)
      c.status(status)
      return c.json({ message })
    }

    return c.json(result.value)
  })
  .get("/verify", async (c) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      c.status(401 as StatusCode)
      return c.json({ message: "Token não fornecido" })
    }

    const result = await authService.verifyToken(token)

    if (result.isErr()) {
      const { status, message } = getErrorResponse(result.error)
      c.status(status)
      return c.json({ message })
    }

    const userResult = await authService.me(result.value.userId)

    if (userResult.isErr()) {
      const { status, message } = getErrorResponse(userResult.error)
      c.status(status)
      return c.json({ message })
    }

    return c.json({
      success: true,
      data: {
        user: userResult.value,
        userId: result.value.userId,
      },
    })
  })
  .post("/signup", zValidator("json", AuthModel.signUp), async (c) => {
    const data = c.req.valid("json")
    const result = await authService.signUp(data)

    if (result.isErr()) {
      const { status, message } = getErrorResponse(result.error)
      c.status(status)
      return c.json({ message })
    }

    setCookie(c, COOKIE_KEYS.userId, String(result.value.user.id), COOKIE_CONFIG)
    setCookie(c, COOKIE_KEYS.token, result.value.token, COOKIE_CONFIG)

    return c.json({
      success: true,
      data: result.value,
    })
  })
  .post("/signin", zValidator("json", AuthModel.signIn), async (c) => {
    const data = c.req.valid("json")
    const result = await authService.signIn(data)

    if (result.isErr()) {
      const { status, message } = getErrorResponse(result.error)
      c.status(status)
      return c.json({ message })
    }

    setCookie(c, COOKIE_KEYS.userId, String(result.value.user.id), COOKIE_CONFIG)
    setCookie(c, COOKIE_KEYS.token, result.value.token, COOKIE_CONFIG)

    return c.json({
      success: true,
      data: result.value,
    })
  })
  .post("/signout", async (c) => {
    setCookie(c, COOKIE_KEYS.userId, "", { ...COOKIE_CONFIG, maxAge: 0 })
    setCookie(c, COOKIE_KEYS.token, "", { ...COOKIE_CONFIG, maxAge: 0 })

    return c.json({
      success: true,
      data: null,
    })
  })
