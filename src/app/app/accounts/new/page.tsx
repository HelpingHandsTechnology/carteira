"use client"

import { useCreateAccountMutation } from "@/hooks/react-query/accounts.query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TypographyH1 } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  serviceName: z.string().min(1, "O nome do serviço é obrigatório"),
  startDate: z.string().min(1, "A data de início é obrigatória"),
  expirationDate: z.string().min(1, "A data de expiração é obrigatória"),
  maxUsers: z.string().min(1, "O número de usuários é obrigatório").transform(Number),
  price: z.string().min(1, "O preço é obrigatório"),
})

type FormValues = z.infer<typeof formSchema>

export default function NewAccountPage() {
  const router = useRouter()
  const createAccount = useCreateAccountMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceName: "",
      startDate: "",
      expirationDate: "",
      maxUsers: 0,
      price: "",
    },
  })

  function onSubmit(data: FormValues) {
    createAccount.mutate(data, {
      onSuccess: () => {
        toast.success(CONTENT.toast.success)
        router.push("/app")
      },
    })
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="space-y-2">
          <Button variant="ghost" className="pl-0" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <TypographyH1>Nova Assinatura</TypographyH1>
        </div>

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Informações da Assinatura</CardTitle>
                <CardDescription>Preencha os dados da sua nova assinatura</CardDescription>
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
                <Button type="submit" className="w-full" disabled={createAccount.isPending}>
                  {createAccount.isPending ? "Criando..." : "Criar Assinatura"}
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
  title: "Nova Assinatura",
  backButton: "Voltar",
  form: {
    title: "Informações da Assinatura",
    description: "Preencha os dados da sua nova assinatura",
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
      default: "Criar Assinatura",
      loading: "Criando...",
    },
  },
  toast: {
    success: "Assinatura criada com sucesso!",
  },
}
