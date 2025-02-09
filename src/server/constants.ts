export const JWT_SECRET = process.env.JWT_SECRET || "super-secret"

export const COOKIE_KEYS = {
  userId: "carteira-user-id",
  token: "carteira-token",
} as const

export const COOKIE_CONFIG = {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 dias
  httpOnly: true,
  secure: true,
  sameSite: "strict",
} as const
