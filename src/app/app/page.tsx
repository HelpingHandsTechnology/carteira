"use client"
import { useUser, useLogoutMutation } from "@/hooks/react-query/auth.query"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AccountsSection } from "./components/accounts-section"
import { Header } from "./components/header"
import { Sidebar } from "@/components/ui/sidebar"

export default function AppPage() {
  const router = useRouter()
  const { data: user } = useUser()
  const logout = useLogoutMutation()

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logout realizado com sucesso!")
        router.push("/login")
      },
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="container mx-auto py-8">
          <AccountsSection />
        </div>
      </main>
    </div>
  )
}
