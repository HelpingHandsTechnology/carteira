"use client"
import { useUser, useLogoutMutation } from "@/hooks/react-query/auth.query"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
        <Button variant="outline" onClick={handleLogout} disabled={logout.isPending}>
          {logout.isPending ? "Saindo..." : "Sair"}
        </Button>
      </div>

      <pre className="bg-muted p-4 rounded-lg">{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
