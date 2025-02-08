"use client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Home, User, Settings, DollarSign } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

const navItems = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "About",
    url: "/about",
    icon: User,
  },
  {
    name: "Projects",
    url: "/projects",
    icon: Settings,
  },
  {
    name: "Resume",
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

        <footer className="bg-gray-900 text-gray-300">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Carteira</h3>
                <p className="text-sm">
                  Gerencie suas assinaturas de forma inteligente, compartilhe custos e economize com segurança.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Recursos</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/features/sharing" className="text-sm hover:text-white">
                      Compartilhamento
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/security" className="text-sm hover:text-white">
                      Segurança
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/payments" className="text-sm hover:text-white">
                      Pagamentos
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm hover:text-white">
                      Planos
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Suporte</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/help" className="text-sm hover:text-white">
                      Central de Ajuda
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:text-white">
                      Contato
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-sm hover:text-white">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/feedback" className="text-sm hover:text-white">
                      Feedback
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-sm hover:text-white">
                      Privacidade
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm hover:text-white">
                      Termos
                    </Link>
                  </li>
                  <li>
                    <Link href="/security-policy" className="text-sm hover:text-white">
                      Política de Segurança
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm">© {new Date().getFullYear()} Carteira. Todos os direitos reservados.</p>
                <div className="flex items-center gap-6">
                  <Link href="https://twitter.com/carteira" className="text-sm hover:text-white">
                    Twitter
                  </Link>
                  <Link href="https://linkedin.com/company/carteira" className="text-sm hover:text-white">
                    LinkedIn
                  </Link>
                  <Link href="https://github.com/carteira" className="text-sm hover:text-white">
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
