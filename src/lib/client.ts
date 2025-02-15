import { env } from "@/env"
import { hc } from "hono/client"
import { AppType } from "../server/app"

export const client = hc<AppType>(env.NEXT_PUBLIC_URL)
