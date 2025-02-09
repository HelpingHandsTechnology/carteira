import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { authService, type AuthError } from "../services/auth"
import { match } from "ts-pattern"
import { COOKIE_KEYS, COOKIE_CONFIG } from "../constants"
import { setCookie } from "hono/cookie"
import { StatusCode } from "hono/utils/http-status"
import { validateToken, validateUserIdOnCookies } from "../middlewares/auth"

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
  .get("/me", validateUserIdOnCookies, async (c) => {
    const userId = c.get("userId")
    const result = await authService.me(userId)

    if (result.isErr()) {
      throw new HTTPException(401, {
        message: result.error.message,
      })
    }

    return c.json(result.value)
  })
  .get("/verify", validateUserIdOnCookies, validateToken, async (c) => {
    const userId = c.get("userId")
    const result = await authService.me(userId)

    if (result.isErr()) {
      throw new HTTPException(401, {
        message: result.error.message,
      })
    }

    return c.json({
      user: result.value,
      userId,
    })
  })
  .post("/signup", zValidator("json", AuthModel.signUp), async (c) => {
    const data = c.req.valid("json")
    const result = await authService.signUp(data)

    if (result.isErr()) {
      throw new HTTPException(401, {
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
      throw new HTTPException(401, {
        message: result.error.message,
      })
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

    return c.json(null)
  })
