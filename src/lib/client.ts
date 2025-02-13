import { AppType } from "../server/app"
import { hc } from "hono/client"
import { env } from "./env"

console.log(env.PUBLIC_URL)
export const client = hc<AppType>(env.PUBLIC_URL ?? '')
