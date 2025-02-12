import { COOKIE_KEYS } from "../constants"
import { authService } from "../services/auth"
import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { AppError } from "@/lib/errors"
import { User } from "../db"

export const authMiddleware = createMiddleware<{
  Variables: {
    userId: string
  }
}>(async (c, next) => {
  const userId = getCookie(c, COOKIE_KEYS.userId)
  const token = getCookie(c, COOKIE_KEYS.token)

  if (!userId || !token) {
    throw new AppError(401, { message: "Usuário não autenticado" })
  }

  const [user, error] = await authService.verifyToken(token)
  if (error) {
    throw new AppError(401, { message: "Usuário não autenticado" })
  }

  c.set("userId", user.userId)
  await next()
})
