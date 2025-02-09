import type { MiddlewareHandler, Context, Next } from "hono"
import { Signale } from "signale"

const logger = new Signale({
  config: {
    displayTimestamp: true,
    displayDate: true,
  },
  types: {
    request: {
      badge: "→",
      color: "blue",
      label: "request",
    },
    response: {
      badge: "←",
      color: "green",
      label: "response",
    },
  },
})

export const loggerMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
  const startTime = performance.now()

  logger.request({
    prefix: c.req.method,
    message: c.req.path,
    suffix: "Request started",
  })

  await next()

  const duration = performance.now() - startTime

  logger.response({
    prefix: c.req.method,
    message: c.req.path,
    suffix: `${duration.toFixed(2)}ms`,
  })
}
