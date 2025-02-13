import { PartnersSection } from "./components/partners-section"
import "./globals.css"
import { AuroraBackground } from "@/app/components/aurora-background"
import { ValueProposition } from "@/app/components/value-proposition"
import { Pricing } from "@/app/components/pricing-cards"
import { BottomCtaSection } from "./components/bototm-cta"
import { RainbowButton } from "./components/rainbow-button"
import Link from "next/link"
import { Footer } from "./components/footer"
import { env } from "@/lib/env"

export default function Home() {
  console.log({allClientEnv: env})
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      <AuroraBackground>
        <PartnersSection className="" />
        <Link href="/login">
          <RainbowButton className="mt-10">Comece agora</RainbowButton>
        </Link>
      </AuroraBackground>
      <ValueProposition />
      <Pricing />
      <BottomCtaSection />
      <Footer />
    </main>
  )
}
