"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Home, User, Settings, DollarSign } from "lucide-react"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

const navItems = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "__About__",
    url: "/about",
    icon: User,
  },
  {
    name: "__Projects__",
    url: "/projects",
    icon: Settings,
  },
  {
    name: "__Resume__",
    url: "/resume",
    icon: DollarSign,
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="fixed top-0 left-0 right-0 z-40">
          <NavBar items={navItems} />
        </header>

        {children}
        <Toaster richColors />
      </body>
    </html>
  )
}
