export type LogLevel = "debug" | "info" | "warn" | "error"

export interface Logger {
  log: (payload: LogPayload) => void
}

export interface LogPayload {
  level: LogLevel
  message: string
  timestamp: string
  path?: string
  method?: string
  duration?: number
  error?: unknown
  metadata?: Record<string, unknown>
}

export type Dehydrate<T> = T extends Date
  ? string
  : T extends Array<infer U>
  ? Array<Dehydrate<U>>
  : T extends object
  ? { [K in keyof T]: Dehydrate<T[K]> }
  : T
