import { env } from "@/lib/env"
import chalk from "chalk"
import type { MiddlewareHandler, Context, Next } from "hono"
import { Signale } from "signale"

export const logger = new Signale({
  config: {
    displayTimestamp: false,
    displayDate: false,
    displayBadge: true,
    displayScope: false,
    displayLabel: false,
  },
  types: {
    request: {
      badge: "→",
      color: "blue",
      label: "request",
      logLevel: "info",
    },
    response: {
      badge: "←",
      color: "green",
      label: "response",
      logLevel: "info",
    },
    error: {
      badge: "✖",
      color: "red",
      label: "error",
      logLevel: "error",
    },
  },
  logLevel: env.NODE_ENV === "test" ? "error" : "info",
})

export const loggerMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
  const startTime = performance.now()

  logger.request({
    prefix: chalk.blue(c.req.method),
    message: c.req.path,
  })

  try {
    await next()
  } catch (error) {
    if (error instanceof Error) {
      const errorDetails = error.stack
        ?.split("\n")
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("at "))
        .map((line) => `    ${line}`)

      logger.error({
        prefix: chalk.red("error"),
        message: chalk.bold(error.message) + "\n" + chalk.dim(errorDetails?.join("\n")) + "\n",
      })
    } else {
      logger.error({
        prefix: chalk.red("error"),
        message: chalk.bold("Unknown error"),
      })
    }
    throw error
  }

  const duration = performance.now() - startTime

  logger.response({
    prefix: chalk.green(c.req.method),
    message: `${c.req.path} ${chalk.dim(`${duration.toFixed(2)}ms`)}`,
    suffix: c.res.status >= 400 ? chalk.red(c.res.status) : chalk.green(c.res.status),
  })
}
