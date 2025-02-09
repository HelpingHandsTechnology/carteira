"use client"
import { useUser } from "@/hooks/react-query/auth.query"

export default function AppPage() {
  const { data: user } = useUser()

  return (
    <div>
      <h1>AppPage</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
