"use client"

import { useAccountQuery } from "@/hooks/react-query/accounts.query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyH1, TypographyH2, TypographyP } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit2Icon, Trash2Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useDeleteAccountMutation } from "@/hooks/react-query/accounts.query"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AccountDetailsPage() {
  const params = useParams()
  const accountId = params.accountId as string
  const router = useRouter()
  const { data: account, isLoading } = useAccountQuery(accountId)
  const deleteAccount = useDeleteAccountMutation()

  function handleDelete() {
    deleteAccount.mutate(accountId, {
      onSuccess: () => {
        toast.success(CONTENT.toast.deleteSuccess)
        router.push("/app")
      },
    })
  }

  if (isLoading) {
    return <AccountDetailsSkeleton />
  }

  if (!account) {
    return <AccountNotFound />
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className={cn("flex items-center", "justify-between")}>
        <div className="space-y-1">
          <Button variant="ghost" className="pl-0 mb-2" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <TypographyH1>{account.serviceName}</TypographyH1>
          <Badge variant={account.status === "ACTIVE" ? "default" : "secondary"}>
            {CONTENT.statusLabels[account.status]}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/app/accounts/${params.accountId}/edit`)}>
            <Edit2Icon className="mr-2 h-4 w-4" />
            Editar
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente a assinatura e todos os dados
                  associados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {deleteAccount.isPending ? "Excluindo..." : "Sim, excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <TypographyP>Preço:</TypographyP>
              <TypographyP>R$ {account.price}</TypographyP>
            </div>
            <div className="flex justify-between">
              <TypographyP>Usuários:</TypographyP>
              <TypographyP>{account.maxUsers}</TypographyP>
            </div>
            <div className="flex justify-between">
              <TypographyP>Data de Início:</TypographyP>
              <TypographyP>
                {format(new Date(account.startDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TypographyP>
            </div>
            <div className="flex justify-between">
              <TypographyP>Data de Expiração:</TypographyP>
              <TypographyP>
                {format(new Date(account.expirationDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TypographyP>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitações de Acesso</CardTitle>
            <CardDescription>Gerencie as solicitações de acesso à sua assinatura</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyAccessRequests />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AccountDetailsSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className={cn("flex items-center", "justify-between")}>
        <div className="space-y-1">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AccountNotFound() {
  const router = useRouter()

  return (
    <div className="container mx-auto py-8">
      <Card className={cn("flex flex-col items-center justify-center", "p-8", "text-center")}>
        <CardHeader>
          <CardTitle>{CONTENT.notFound.title}</CardTitle>
          <CardDescription>{CONTENT.notFound.description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push("/app")}>Voltar para o início</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function EmptyAccessRequests() {
  return (
    <div className={cn("flex flex-col items-center justify-center", "p-8", "text-center", "border rounded-lg")}>
      <TypographyH2>{CONTENT.emptyAccessRequests.title}</TypographyH2>
      <TypographyP>{CONTENT.emptyAccessRequests.description}</TypographyP>
    </div>
  )
}

const CONTENT = {
  backButton: "Voltar",
  editButton: "Editar",
  deleteButton: {
    default: "Excluir",
    loading: "Excluindo...",
  },
  deleteDialog: {
    title: "Tem certeza?",
    description:
      "Esta ação não pode ser desfeita. Isso excluirá permanentemente a assinatura e todos os dados associados.",
    cancel: "Cancelar",
    confirm: "Sim, excluir",
  },
  generalInfo: {
    title: "Informações Gerais",
    price: "Preço:",
    users: "Usuários:",
    startDate: "Data de Início:",
    expirationDate: "Data de Expiração:",
  },
  accessRequests: {
    title: "Solicitações de Acesso",
    description: "Gerencie as solicitações de acesso à sua assinatura",
  },
  notFound: {
    title: "Assinatura não encontrada",
    description: "A assinatura que você está procurando não existe ou foi removida.",
    backButton: "Voltar para o início",
  },
  emptyAccessRequests: {
    title: "Nenhuma solicitação",
    description: "Você ainda não recebeu nenhuma solicitação de acesso para esta assinatura.",
  },
  statusLabels: {
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    EXPIRED: "Expirada",
  },
  toast: {
    deleteSuccess: "Assinatura excluída com sucesso!",
  },
}
