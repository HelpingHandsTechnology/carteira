import { Check, Gift, MoveRight, PartyPopper, PhoneCall } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TypographyH2, TypographyP, TypographyLead, TypographySmall } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface PricingProps {
  className?: string
}

export function Pricing({ className }: PricingProps) {
  return (
    <div className={cn(className)}>
      <div className={cn("container mx-auto")}>
        <div className={cn("flex gap-4 flex-col")}>
          <Badge className="self-start">{CONTENT.badge}</Badge>
          <div className="flex gap-2 flex-col">
            <TypographyH2 className="text-sm md:text-5xl tracking-tighter font-regular">{CONTENT.title}</TypographyH2>
            <TypographyLead className="text-muted-foreground leading-relaxed max-w-xl">
              {CONTENT.description}
            </TypographyLead>
          </div>
          <div className="flex justify-center w-full pt-10">
            <div className="w-full max-w-2xl">
              {CONTENT.plans.map((plan) => (
                <PricingCard key={plan.id} {...plan} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PricingCard({
  title,
  description,
  price,
  features,
  buttonText,
  badge,
  buttonIcon: Icon,
  variant = "outline",
}: PricingCardProps) {
  return (
    <Card className={cn("w-full rounded-md", variant === "featured" && "shadow-2xl")}>
      <CardHeader>
        <CardTitle>
          <pre className="flex flex-row gap-4 items-center font-normal">{title}</pre>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 justify-start">
          <p className="flex flex-row items-center gap-2 text-xl">
            <span className="text-4xl">R${price}</span>
            <span className="text-sm text-muted-foreground"> / mês</span>
          </p>
          <div className="flex flex-col gap-4 justify-start">
            {features.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
          <Button variant={variant === "featured" ? "default" : "outline"} className="gap-4">
            {buttonText} <Icon className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FeatureItem({ title, description, badge }: { title: string; description: string; badge?: string }) {
  return (
    <div className="flex flex-row gap-4">
      <Check className="w-4 h-4 mt-2 text-primary" />
      <div className="flex flex-col">
        <TypographyP className="flex flex-row gap-2">
          {title}
          {badge && (
            <span className="flex items-center flex-row gap-2">
              <Badge className="text-sm text-primary-foreground h-4 opacity-40">{badge}</Badge>
            </span>
          )}
        </TypographyP>
        <div className="flex flex-row gap-2">
          <TypographySmall className="text-muted-foreground text-sm">{description}</TypographySmall>
        </div>
      </div>
    </div>
  )
}

interface PricingCardProps {
  title: string
  description: string
  price: number
  features: Array<{
    title: string
    description: string
  }>
  buttonText: string
  buttonIcon: any
  variant?: "default" | "featured" | "outline"
  badge?: string
}

const CONTENT = {
  badge: "Descomplique",
  title: "100% Grátis \n(E Sem Letrinha Miúda Pra Te Pegar)! 🎉",
  description:
    "Por que pagar se você pode compartilhar, economizar e até ganhar um trocado? Nós também odamos taxas escondidas!",
  plans: [
    {
      id: 1,
      title: "Plano Amigo da Onça 🐾",
      description: "Para quem curte um *upgrade* na vida sem *downgrade* na carteira.",
      price: 0,
      features: [
        {
          title: "Assinaturas Ilimitadas",
          description:
            "Adicione quantos serviços quiser: Netflix, Udemy, Crunchyroll, Disney+... Se existe, você pode compartilhar! 🎬",
          badge: "Popular",
        },
        {
          title: "Divisão de Custos Automática",
          description:
            "Para evitar aquele climão no grupo da família. Calculamos tudo, até a sua parte do 'amigo esquecido'. 😅",
        },
        {
          title: "Monetização 'De Quebrada'",
          description:
            "Revenda acessos e transforme sua assinatura em renda extra. Pra pagar a pizza do final de semana! 🍕",
        },
        {
          title: "Dashboard da Economia",
          description: "Veja quanto você salvou pra gastar em coisas que importam: café, memes e sonecas. ☕",
        },
        {
          title: "Notificações Anti-Calote",
          description: "Lembramos você (e o primo distante) de renovar a assinatura. Nada de 'ah, esqueci'!",
          badge: "Em breve",
        },
      ],
      buttonText: "Quero Tudo de Graça! 🤑",
      buttonIcon: PartyPopper, // Ícone de festa para reforçar o tom
      variant: "featured" as const,
    },
  ],
}
