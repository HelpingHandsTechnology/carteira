import { edenTreaty } from "@elysiajs/eden"
import type { AppType } from "@/server"

export const client = edenTreaty<AppType>("http://localhost:3000")
