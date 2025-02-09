"use client"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Home, User, Settings, DollarSign } from "lucide-react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <NavBar items={navItems} />
      {children}
    </header>
  )
}
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
