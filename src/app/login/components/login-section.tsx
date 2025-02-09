"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSignInMutation, useSignUpMutation } from "@/hooks/react-query/auth.query"

export function LoginSection() {
  const [open, setOpen] = useState<"signin" | "signup" | null>(null)

  return (
    <div className={cn("w-full max-w-md", "p-6 rounded-lg", "bg-white/50 backdrop-blur-lg", "border border-border/50")}>
      <div className="space-y-2 text-center mb-8">
        <TypographyH1>{CONTENT.title}</TypographyH1>
        <TypographyP>{CONTENT.description}</TypographyP>
      </div>

      <div className="space-y-4">
        <SignInDialog open={open === "signin"} onOpenChange={(isOpen) => setOpen(isOpen ? "signin" : null)} />
        <SignUpDialog open={open === "signup"} onOpenChange={(isOpen) => setOpen(isOpen ? "signup" : null)} />
      </div>
    </div>
  )
}

function SignInDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const signIn = useSignInMutation()

  function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    signIn.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Login realizado com sucesso!")
          router.push("/app")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" variant="default" className="w-full">
          {CONTENT.signIn.button}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTENT.signIn.title}</DialogTitle>
          <TypographyP>{CONTENT.signIn.description}</TypographyP>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <Label htmlFor="signin-email">E-mail</Label>
            <Input name="email" id="signin-email" type="email" placeholder="Digite seu e-mail" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password">Senha</Label>
            <Input name="password" id="signin-password" type="password" placeholder="Digite sua senha" required />
          </div>
          <Button type="submit" className="w-full" disabled={signIn.isPending}>
            {signIn.isPending ? "Entrando..." : CONTENT.signIn.title}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SignUpDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const signUp = useSignUpMutation()

  function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string
    const name = formData.get("name") as string

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }

    signUp.mutate(
      { email, password, name },
      {
        onSuccess: () => {
          toast.success("Conta criada com sucesso!")
          router.push("/app")
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="w-full">
          {CONTENT.signUp.button}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{CONTENT.signUp.title}</DialogTitle>
          <TypographyP>{CONTENT.signUp.description}</TypographyP>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div className="space-y-2">
            <Label htmlFor="signup-name">Nome</Label>
            <Input name="name" id="signup-name" type="text" placeholder="Digite seu nome" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">E-mail</Label>
            <Input name="email" id="signup-email" type="email" placeholder="Digite seu e-mail" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Senha</Label>
            <Input name="password" id="signup-password" type="password" placeholder="Digite sua senha" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
            <Input
              name="confirm-password"
              id="signup-confirm-password"
              type="password"
              placeholder="Confirme sua senha"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={signUp.isPending}>
            {signUp.isPending ? "Criando conta..." : CONTENT.signUp.title}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const CONTENT = {
  title: "Bem-vindo de volta",
  description: "Entre na sua conta ou crie uma nova.",
  signIn: {
    title: "Entrar",
    description: "Digite seu e-mail e senha para entrar na sua conta.",
    button: "Já possuo conta",
  },
  signUp: {
    title: "Criar conta",
    description: "Preencha as informações para criar uma nova conta.",
    button: "Criar nova conta",
  },
}
