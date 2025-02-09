import { Elysia } from "elysia"
import { Signale } from "signale"

export const logger = new Signale({
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

type LoggerState = {
  startTime: number
}

export const loggerMiddleware = new Elysia({ name: "logger" })
  .state("loggerState", {
    startTime: 0,
  })
  .onAfterHandle(({ request, store }) => {
    const state = store.loggerState as LoggerState
    const duration = performance.now() - state.startTime

    logger.request({
      prefix: request.method,
      message: new URL(request.url).pathname,
      suffix: `${duration.toFixed(2)}ms`,
    })
  })
  .onRequest(async ({ request, store }) => {
    const state = store.loggerState as LoggerState
    state.startTime = performance.now()

    const url = new URL(request.url)
    const params = Object.fromEntries(url.searchParams)

    const details = {
      ...(Object.keys(params).length > 0 && { params }),
    }

    logger.request({
      prefix: request.method,
      message: url.pathname,
      suffix: [Object.keys(details).length > 0 ? JSON.stringify(details) : null]
        .filter(Boolean)
        .map((s) => `[${s}]`)
        .join(" "),
    })
  })
