import { AppType } from "../server/app"
import { hc } from "hono/client"
import { env } from "./env"

console.log(process.env.URL)
export const client = hc<AppType>(env.PUBLIC_URL)
