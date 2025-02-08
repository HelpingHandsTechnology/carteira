export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

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