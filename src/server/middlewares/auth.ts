import { createMiddleware } from "hono/factory"
import { StatusCode } from "hono/utils/http-status"
import { err } from "neverthrow"
import { COOKIE_KEYS } from "../constants"
import { getCookie } from "hono/cookie"
import { AuthError, authService } from "../services/auth"

export const validateUserIdOnCookies = createMiddleware<{
  Variables: {
    userId: string
  }
}>(async (c, next) => {
  const userId = getCookie(c, COOKIE_KEYS.userId)

  if (!userId) {
    const error: AuthError = {
      type: "UNAUTHORIZED",
      message: "Desculpe, não foi possível verificar sua identidade. Por favor, tente novamente.",
    }
    c.status(401 as StatusCode)
    return c.json(err(error))
  }

  c.set("userId", userId)
  await next()
})
