"use client"

import { LogoCarousel } from "@/components/ui/logo-carousel"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Typewriter } from "@/components/ui/typewriter"
import { GradientHeading, headingVariants } from "@/components/ui/gradient-headings"
import Image from "next/image"

export function PartnersSection({ className }: PartnersSectionProps) {
  const isMobile = useIsMobile()

  return (
    <section className={cn(className)}>
      <div className={cn("max-w-7xl mx-auto px-4 flex flex-col items-center gap-4")}>
        <div className={cn("flex flex-col items-center text-center")}>
          <GradientHeading variant="secondary">{CONTENT.title.primary}</GradientHeading>
          <GradientHeading size="xl">{CONTENT.title.secondary}</GradientHeading>
          <Typewriter className={cn(headingVariants({ size: "xl" }))} text={CONTENT.typewriter} />
        </div>
        <LogoCarousel logos={partners} columnCount={4} />
      </div>
    </section>
  )
}

interface PartnersSectionProps {
  className?: string
}

const CONTENT = {
  title: {
    primary: "Gerencie suas assinaturas",
    secondary: "Compartilhe",
  },
  typewriter: ["com um amigo", "com um colega do trabalho", "com quem você ama", "com quem você quiser!"],
}

const partners = [
  {
    name: "Bitwarden",
    id: 1,
    img: (props: any) => (
      <Image
        src="/logos/bitwarden.svg"
        alt="Bitwarden"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
  {
    name: "Netflix",
    id: 2,
    img: (props: any) => (
      <Image src="/logos/netflix.svg" alt="Netflix" className={cn("h-full w-full object-contain", props.className)} />
    ),
  },
  {
    name: "Spotify",
    id: 3,
    img: (props: any) => (
      <Image src="/logos/spotify.svg" alt="Spotify" className={cn("h-full w-full object-contain", props.className)} />
    ),
  },
  {
    name: "Apple TV+",
    id: 4,
    img: (props: any) => (
      <Image
        src="/logos/apple-tv.svg"
        alt="Apple TV+"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
  {
    name: "Prime Video",
    id: 6,
    img: (props: any) => (
      <img
        src="/logos/prime-video.svg"
        alt="Prime Video"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
  {
    name: "Audible",
    id: 7,
    img: (props: any) => (
      <Image src="/logos/audible.svg" alt="Audible" className={cn("h-full w-full object-contain", props.className)} />
    ),
  },
  {
    name: "Coursera",
    id: 8,
    img: (props: any) => (
      <Image src="/logos/coursera.svg" alt="Coursera" className={cn("h-full w-full object-contain", props.className)} />
    ),
  },
  {
    name: "Crunchyroll",
    id: 9,
    img: (props: any) => (
      <img
        src="/logos/crunchroll.svg"
        alt="Crunchyroll"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
  {
    name: "HBO",
    id: 10,
    img: (props: any) => (
      <Image src="/logos/hbo.svg" alt="HBO" className={cn("h-full w-full object-contain", props.className)} />
    ),
  },
  {
    name: "Udemy",
    id: 11,
    img: (props: any) => (
      <Image src="/logos/udemy.svg" alt="Udemy" className={cn("h-full w-full object-contain", props.className)} />
    ),
  },
  {
    name: "Grammarly",
    id: 12,
    img: (props: any) => (
      <Image
        src="/logos/gramally.svg"
        alt="Grammarly"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
  {
    name: "Skillshare",
    id: 13,
    img: (props: any) => (
      <img
        src="/logos/skill-share.svg"
        alt="Skillshare"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
  {
    name: "Canva Pro",
    id: 14,
    img: (props: any) => (
      <Image
        src="/logos/canva-pro.svg"
        alt="Canva Pro"
        className={cn("h-full w-full object-contain", props.className)}
      />
    ),
  },
]
