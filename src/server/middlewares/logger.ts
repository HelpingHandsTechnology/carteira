import { Logger, LogPayload } from '@/lib/types'
import { Elysia } from 'elysia'

const createLogger = (): Logger => {
  return {
    log: (payload: LogPayload) => {
      console.log(JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      }))
    }
  }
}

type LoggerState = {
  logger: Logger
  startTime: number
}

export const logger = new Elysia({ name: 'logger' })
  .state('loggerState', {
    logger: createLogger(),
    startTime: 0
  })
  .onRequest(({ request, store }) => {
    const state = store.loggerState as LoggerState
    state.startTime = performance.now()
    state.logger.log({
      level: 'info',
      message: `Incoming ${request.method} request`,
      path: new URL(request.url).pathname,
      method: request.method,
      timestamp: new Date().toISOString()
    })
  })
  .onAfterHandle(({ request, store }) => {
    const state = store.loggerState as LoggerState
    const duration = performance.now() - state.startTime
    state.logger.log({
      level: 'info',
      message: `Completed ${request.method} request`,
      path: new URL(request.url).pathname,
      method: request.method,
      duration,
      timestamp: new Date().toISOString()
    })
  })
  .onError(({ error, request, store }) => {
    const state = store.loggerState as LoggerState
    state.logger.log({
      level: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      path: new URL(request.url).pathname,
      method: request.method,
      timestamp: new Date().toISOString()
    })
  }) 