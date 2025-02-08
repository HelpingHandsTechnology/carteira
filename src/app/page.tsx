import { HeroSection } from "./components/hero-section"
import { PartnersSection } from "./components/partners-section"
import { FeaturesSection } from "./components/features-section"
import { CTASection } from "./components/cta-section"
import "./globals.css"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <PartnersSection className="py-16" />
      <FeaturesSection className="py-16" />
      <CTASection className="py-16" />
    </main>
  )
}
