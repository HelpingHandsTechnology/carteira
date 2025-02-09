"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

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

export function LoginSection() {
  return (
    <div className={cn("w-full max-w-md", "p-6 rounded-lg", "bg-white/50 backdrop-blur-lg", "border border-border/50")}>
      <div className="space-y-2 text-center mb-8">
        <TypographyH1>{CONTENT.title}</TypographyH1>
        <TypographyP>{CONTENT.description}</TypographyP>
      </div>

      <div className="space-y-4">
        <Dialog>
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

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">E-mail</Label>
                <Input id="signin-email" type="email" placeholder="Digite seu e-mail" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Senha</Label>
                <Input id="signin-password" type="password" placeholder="Digite sua senha" required />
              </div>
              <Button type="submit" className="w-full">
                {CONTENT.signIn.title}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
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

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">E-mail</Label>
                <Input id="signup-email" type="email" placeholder="Digite seu e-mail" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Senha</Label>
                <Input id="signup-password" type="password" placeholder="Digite sua senha" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                <Input id="signup-confirm-password" type="password" placeholder="Confirme sua senha" required />
              </div>
              <Button type="submit" className="w-full">
                {CONTENT.signUp.title}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
