import { PartnersSection } from "./components/partners-section"
import { FeaturesSection } from "./components/features-section"
import { CTASection } from "./components/cta-section"
import "./globals.css"
import { AuroraBackground } from "@/app/components/aurora-background"
import { ValueProposition } from "@/app/components/value-proposition"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <AuroraBackground>
        <PartnersSection className="" />
      </AuroraBackground>
      <ValueProposition />
      <FeaturesSection className="" />
      <CTASection className="py-16" />
    </main>
  )
}
