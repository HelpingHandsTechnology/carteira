"use client"

import { LogoCarousel } from "@/components/ui/logo-carousel"
import { GradientHeading } from "@/components/ui/gradient-headings"
import { cn } from "@/lib/utils"

interface PartnersSectionProps {
  className?: string
}

const partners = [
  {
    name: "Bitwarden",
    id: 1,
    img: () => <img src="/logos/bitwarden.svg" alt="Bitwarden" className="h-full w-full object-contain" />,
  },
  {
    name: "Netflix",
    id: 2,
    img: () => <img src="/logos/netflix.svg" alt="Netflix" className="h-full w-full object-contain" />,
  },
  {
    name: "Spotify",
    id: 3,
    img: () => <img src="/logos/spotify.svg" alt="Spotify" className="h-full w-full object-contain" />,
  },
  {
    name: "Apple TV+",
    id: 4,
    img: () => <img src="/logos/apple-tv.svg" alt="Apple TV+" className="h-full w-full object-contain" />,
  },
  {
    name: "Disney+",
    id: 5,
    img: () => <img src="/logos/disney-plus.svg" alt="Disney+" className="h-full w-full object-contain" />,
  },
  {
    name: "Amazon Prime",
    id: 6,
    img: () => <img src="/logos/prime.svg" alt="Amazon Prime" className="h-full w-full object-contain" />,
  },
]

export function PartnersSection({ className }: PartnersSectionProps) {
  return (
    <section className={cn("bg-white ", className)}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center text-center">
          <GradientHeading variant="secondary">Gerencie suas assinaturas</GradientHeading>
          <GradientHeading size="xl">Compartilhe com quem você ama</GradientHeading>
        </div>
        <LogoCarousel logos={partners} columnCount={3} />
      </div>
    </section>
  )
}
