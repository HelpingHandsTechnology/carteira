"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TypographyH1, TypographyP } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const CONTENT = {
  title: "Welcome back",
  description: "Sign in to your account or create a new one.",
  signIn: {
    title: "Sign in",
    description: "Enter your email and password to sign in to your account.",
  },
  signUp: {
    title: "Create account",
    description: "Enter your information to create a new account.",
  },
}

export function LoginSection() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className={cn("w-full max-w-md", "p-6 rounded-lg", "bg-white/50 backdrop-blur-lg", "border border-border/50")}>
      <div className="space-y-2 text-center mb-8">
        <TypographyH1>{CONTENT.title}</TypographyH1>
        <TypographyP>{CONTENT.description}</TypographyP>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            {isSignUp ? "Create account" : "Sign in"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isSignUp ? CONTENT.signUp.title : CONTENT.signIn.title}</DialogTitle>
            <TypographyP>{isSignUp ? CONTENT.signUp.description : CONTENT.signIn.description}</TypographyP>
          </DialogHeader>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" required />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm your password" required />
              </div>
            )}
            <Button type="submit" className="w-full">
              {isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="text-center">
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="text-sm">
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
