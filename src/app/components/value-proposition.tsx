import { Shield, Calculator, DollarSign, LayoutDashboard, Bell, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TypographyH2, TypographyP, TypographyLead, TypographyH3 } from "@/components/ui/typography"
import { title } from "process"

export function ValueProposition() {
  return (
    <div className={cn("w-full")}>
      <div className={cn("container mx-auto")}>
        <div className={cn("flex gap-4 py-20 lg:py-40 flex-col items-start")}>
          <div>
            <Badge>{CONTENT.badge}</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <TypographyH2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
              {CONTENT.title}
            </TypographyH2>
            <TypographyLead className="max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              {CONTENT.description}
            </TypographyLead>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {CONTENT.features.map((feature) => (
                <FeatureItem key={feature.id} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="flex flex-row gap-4 md:gap-6 w-full items-start">
      <Icon className="w-5 h-5 mt-1 text-primary shrink-0" />
      <div className="flex flex-col gap-1">
        <TypographyH3>{title}</TypographyH3>
        <TypographyP className="text-muted-foreground text-sm">{description}</TypographyP>
      </div>
    </div>
  )
}

const CONTENT = {
  badge: "Plataforma",
  title: "Compartilhe, Economize e Lucre com Suas Assinaturas",
  description: "Gerencie serviços como Netflix e Spotify em um só lugar, com segurança e praticidade.",
  features: [
    {
      id: 1,
      icon: Shield,
      title: "Segurança Blindada",
      description: "Senhas armazenadas com criptografia via Bitwarden. Seus dados nunca ficam expostos.",
    },
    {
      id: 2,
      icon: Calculator,
      title: "Divisão Automatizada de Custos",
      description: "O app calcula quanto cada um deve pagar, simplificando o rateio entre amigos ou familiares.",
    },
    {
      id: 3,
      icon: DollarSign,
      title: "Monetização Simplificada",
      description: "Revenda acessos a terceiros e transforme suas assinaturas em renda extra.",
    },
    {
      id: 4,
      icon: LayoutDashboard,
      title: "Controle Total",
      description: "Dashboard intuitivo para ver sua economia, prazos de renovação e histórico de transações.",
    },
    {
      id: 5,
      icon: Bell,
      title: "Notificações Inteligentes",
      description: "Alertas para pagamentos, trocas de senha e renovações. Nada passa despercebido.",
    },
    {
      id: 6,
      icon: Smartphone,
      title: "Interface Moderna",
      description: "Design intuitivo para gerenciar tudo em poucos cliques, sem complicação.",
    },
  ],
}
