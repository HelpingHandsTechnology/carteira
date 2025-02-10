"use client"

import { useUser, useLogoutMutation } from "@/hooks/react-query/auth.query"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TypographyH1 } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

export function Header() {
  const router = useRouter()
  const { data: user } = useUser()
  const logout = useLogoutMutation()

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logout realizado com sucesso!")
        router.push("/auth/signin")
      },
    })
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "w-full",
        "border-b",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <div className={cn("container flex h-14 items-center", "justify-between")}>
        <TypographyH1>Bem-vindo, {user?.name}!</TypographyH1>
        <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>
          {logout.isPending ? "Saindo..." : "Sair"}
        </Button>
      </div>
    </header>
  )
}

const CONTENT = {
  welcomeText: "Bem-vindo",
  logoutButton: {
    default: "Sair",
    loading: "Saindo...",
  },
  toast: {
    success: "Logout realizado com sucesso!",
  },
}
