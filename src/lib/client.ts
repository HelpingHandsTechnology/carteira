import { AppType } from "../server/app"
import { hc } from "hono/client"
import { env } from "./env"

export const client = hc<AppType>(env.NEXT_PUBLIC_URL ?? '')
console.log({ClientEnv: env})