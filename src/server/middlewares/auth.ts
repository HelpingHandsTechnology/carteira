import { AppError } from "@/lib/errors"
import { getCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"
import { AppDeps } from "../app"
import { COOKIE_KEYS } from "../constants"
import { AuthService } from "../services/auth"

export const authMiddleware = createMiddleware<{
  Variables: AppDeps & {
    userId: string
  }
}>(async (c, next) => {
  const userId = getCookie(c, COOKIE_KEYS.userId)
  const token = getCookie(c, COOKIE_KEYS.token)

  if (!userId || !token) {
    throw new AppError(401, { message: "Usuário não autenticado" })
  }

  const [user, error] = await AuthService.verifyToken(token)

  if (error) {
    throw new AppError(401, { message: "Usuário não autenticado" })
  }

  c.set("userId", user.userId)
  await next()
})
