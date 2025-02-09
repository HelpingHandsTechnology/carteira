"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Home, User, Settings, DollarSign } from "lucide-react"
import { Toaster } from "sonner"
import { Providers } from "./components/providers"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
