import { AppType } from "../server/app"
import { hc } from "hono/client"
export const client = hc<AppType>(window.location.origin)
