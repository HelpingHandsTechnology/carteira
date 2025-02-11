"use client"

import { useAccountQuery, useUpdateAccountMutation } from "@/hooks/react-query/accounts.query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyH1 } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

const formSchema = z.object({
  serviceName: z.string().min(1, "O nome do serviço é obrigatório"),
  startDate: z.string().min(1, "A data de início é obrigatória"),
  expirationDate: z.string().min(1, "A data de expiração é obrigatória"),
  maxUsers: z.string().min(1, "O número de usuários é obrigatório").transform(Number),
  price: z.string().min(1, "O preço é obrigatório"),
})

type FormValues = z.infer<typeof formSchema>

export default function EditAccountPage() {
  const router = useRouter()
  const params = useParams()
  const accountId = params.accountId as string
  const { data: account, isLoading } = useAccountQuery(accountId)
  const updateAccount = useUpdateAccountMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: account?.serviceName ?? "",
      startDate: account?.startDate ? format(new Date(account.startDate), "yyyy-MM-dd") : "",
      expirationDate: account?.expirationDate ? format(new Date(account.expirationDate), "yyyy-MM-dd") : "",
      maxUsers: account?.maxUsers ?? 0,
      price: account?.price ?? "",
    },
  })

  function onSubmit(data: FormValues) {
    updateAccount.mutate(
      { id: accountId, data },
      {
        onSuccess: () => {
          toast.success(CONTENT.toast.success)
          router.push(`/app/accounts/${accountId}`)
        },
      }
    )
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!account) {
    return <div>Conta não encontrada</div>
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <Button variant="ghost" className="pl-0" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <TypographyH1>Editar Assinatura</TypographyH1>
        </div>

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Informações da Assinatura</CardTitle>
                <CardDescription>Atualize os dados da sua assinatura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="serviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Netflix" {...field} />
                      </FormControl>
                      <FormDescription>O nome do serviço que você está compartilhando</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>Quando a assinatura começa</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Expiração</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>Quando a assinatura termina</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="maxUsers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Usuários</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} placeholder="Ex: 4" {...field} />
                        </FormControl>
                        <FormDescription>Quantos usuários podem compartilhar</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 39.90" {...field} />
                        </FormControl>
                        <FormDescription>Valor mensal da assinatura</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={updateAccount.isPending}>
                  {updateAccount.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}

const CONTENT = {
  title: "Editar Assinatura",
  backButton: "Voltar",
  form: {
    title: "Informações da Assinatura",
    description: "Atualize os dados da sua assinatura",
    serviceName: {
      label: "Nome do Serviço",
      placeholder: "Ex: Netflix",
      description: "O nome do serviço que você está compartilhando",
    },
    startDate: {
      label: "Data de Início",
      description: "Quando a assinatura começa",
    },
    expirationDate: {
      label: "Data de Expiração",
      description: "Quando a assinatura termina",
    },
    maxUsers: {
      label: "Número de Usuários",
      placeholder: "Ex: 4",
      description: "Quantos usuários podem compartilhar",
    },
    price: {
      label: "Preço",
      placeholder: "Ex: 39.90",
      description: "Valor mensal da assinatura",
    },
    submitButton: {
      default: "Salvar Alterações",
      loading: "Salvando...",
    },
  },
  toast: {
    success: "Assinatura atualizada com sucesso!",
  },
}
