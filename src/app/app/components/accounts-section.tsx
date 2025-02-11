"use client"

import { useAccountsQuery } from "@/hooks/react-query/accounts.query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyH2, TypographyP } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"
import { Account } from "@/server/db"
import { Dehydrate } from "@/lib/types"

export function AccountsSection() {
  const router = useRouter()
  const { data: accounts, isLoading } = useAccountsQuery()

  if (isLoading) {
    return <AccountsSkeletonList />
  }

  return (
    <section className="space-y-6">
      <div className={cn("flex items-center", "justify-between")}>
        <TypographyH2>Suas Assinaturas</TypographyH2>
        <Button onClick={() => router.push("/app/accounts/new")}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nova Assinatura
        </Button>
      </div>

      {accounts?.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={cn("grid gap-4", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3")}>
          {accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </section>
  )
}

function AccountCard({ account }: { account: Dehydrate<Account> }) {
  const router = useRouter()

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{account.serviceName}</CardTitle>
        <CardDescription>
          <Badge variant={account.status === "ACTIVE" ? "default" : "secondary"}>
            {CONTENT.statusLabels[account.status]}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex justify-between">
            <TypographyP>Preço:</TypographyP>
            <TypographyP>R$ {account.price}</TypographyP>
          </div>
          <div className="flex justify-between">
            <TypographyP>Usuários:</TypographyP>
            <TypographyP>{account.maxUsers}</TypographyP>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => router.push(`/app/accounts/${account.id}`)}>
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className={cn("flex flex-col items-center justify-center", "p-8", "text-center")}>
      <CardHeader>
        <CardTitle>{CONTENT.emptyState.title}</CardTitle>
        <CardDescription>{CONTENT.emptyState.description}</CardDescription>
      </CardHeader>
    </Card>
  )
}

function AccountsSkeletonList() {
  return (
    <div className={cn("grid gap-4", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3")}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const CONTENT = {
  title: "Suas Assinaturas",
  newAccountButton: "Nova Assinatura",
  viewDetailsButton: "Ver Detalhes",
  emptyState: {
    title: "Nenhuma assinatura encontrada",
    description: "Você ainda não possui nenhuma assinatura cadastrada. Clique no botão acima para criar uma nova.",
  },
  statusLabels: {
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    EXPIRED: "Expirada",
  },
}
