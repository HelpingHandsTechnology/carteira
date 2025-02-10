import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { authService, type AuthError } from "../services/auth"
import { match } from "ts-pattern"
import { COOKIE_KEYS, COOKIE_CONFIG } from "../constants"
import { setCookie } from "hono/cookie"
import { StatusCode } from "hono/utils/http-status"
import { authMiddleware } from "../middlewares/auth"
import { AppError } from "@/lib/errors"

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

export const authRouter = new Hono()
  .get("/me", authMiddleware, async (c) => {
    const userId = c.get("userId")
    const result = await authService.me(userId)

    if (result.isErr()) {
      throw new AppError(401, {
        message: result.error.message,
      })
    }

    return c.json(result.value)
  })
  .get("/verify", async (c) => {
    const token = c.req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new AppError(401, {
        message: "Token não fornecido",
      })
    }

    const result = await authService.verifyToken(token)
    if (result.isErr()) {
      throw new AppError(401, {
        message: result.error.message,
      })
    }
    const user = await authService.me(String(result.value.userId))

    if (user.isErr()) {
      throw new AppError(401, {
        message: user.error.message,
      })
    }

    return c.json(user.value)
  })
  .post("/signup", zValidator("json", AuthModel.signUp), async (c) => {
    const data = c.req.valid("json")
    const result = await authService.signUp(data)

    if (result.isErr()) {
      throw new AppError(401, {
        message: result.error.message,
      })
    }

    setCookie(c, COOKIE_KEYS.userId, String(result.value.user.id), COOKIE_CONFIG)
    setCookie(c, COOKIE_KEYS.token, result.value.token, COOKIE_CONFIG)

    return c.json(result.value)
  })
  .post("/signin", zValidator("json", AuthModel.signIn), async (c) => {
    const data = c.req.valid("json")
    const result = await authService.signIn(data)

    if (result.isErr()) {
      throw new AppError(401, {
        message: result.error.message,
      })
    }

    setCookie(c, COOKIE_KEYS.userId, String(result.value.user.id), COOKIE_CONFIG)
    setCookie(c, COOKIE_KEYS.token, result.value.token, COOKIE_CONFIG)

    return c.json(result.value)
  })
  .post("/signout", async (c) => {
    setCookie(c, COOKIE_KEYS.userId, "", { ...COOKIE_CONFIG, maxAge: 0 })
    setCookie(c, COOKIE_KEYS.token, "", { ...COOKIE_CONFIG, maxAge: 0 })

    return c.json(null)
  })
