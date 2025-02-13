import { AppType } from "../server/app"
import { hc } from "hono/client"
import { env } from "./env"

console.log(env.REACT_APP_URL)
export const client = hc<AppType>(env.REACT_APP_URL)
