import { logger } from "@/server/middlewares/logger"
import chalk from "chalk"
import { Context } from "hono"
import { HTTPException } from "hono/http-exception"
import { ContentfulStatusCode } from "hono/utils/http-status"

type HTTPExceptionOptions = {
  res?: Response
  message?: string
  cause?: unknown
}

export class AppError extends HTTPException {
  constructor(status: ContentfulStatusCode, params: HTTPExceptionOptions) {
    super(status, params)
    this.name = "AppError"
    const stack = new Error().stack
    const errorDetails = stack
      ?.split("\n")
      .slice(2, 7)
      .map((line) => line.trim())
      .map((line) => `    ${line}`)

    logger.error({
      prefix: "\n" + chalk.red("error"),
      message: chalk.bold(params.message) + "\n" + chalk.dim(errorDetails?.join("\n")) + "\n",
    })
  }
}
