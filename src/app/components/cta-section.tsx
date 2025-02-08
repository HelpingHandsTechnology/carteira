"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface CTASectionProps {
  className?: string
}

export function CTASection({ className }: CTASectionProps) {
  return (
    <section className={cn(" bg-gray-50", className)}>
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para começar?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Junte-se a milhares de usuários que já estão gerenciando suas finanças de forma mais inteligente
        </p>
        <Link
          href="/register"
          className="inline-block px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Criar Conta Grátis
        </Link>
      </div>
    </section>
  )
}
