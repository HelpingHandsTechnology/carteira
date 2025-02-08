import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function ValueProposition() {
  return (
    <div className={cn("w-full")}>
      <div className={cn("container mx-auto")}>
        <div className={cn("flex gap-4 py-20 lg:py-40 flex-col items-start")}>
          <div>
            <Badge>{CONTENT.badge}</Badge>
          </div>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">{CONTENT.title}</h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              {CONTENT.description}
            </p>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
              {CONTENT.features.map((feature) => (
                <FeatureItem key={feature.id} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-row gap-6 w-full items-start">
      <Check className="w-4 h-4 mt-2 text-primary" />
      <div className="flex flex-col gap-1">
        <p>{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}

const CONTENT = {
  badge: "Platform",
  title: "Something new!",
  description: "Managing a small business today is already tough.",
  features: [
    {
      id: 1,
      title: "Easy to use",
      description: "We've made it easy to use and understand.",
    },
    {
      id: 2,
      title: "Fast and reliable",
      description: "We've made it fast and reliable.",
    },
    {
      id: 3,
      title: "Beautiful and modern",
      description: "We've made it beautiful and modern.",
    },
    {
      id: 4,
      title: "Easy to use",
      description: "We've made it easy to use and understand.",
    },
    {
      id: 5,
      title: "Fast and reliable",
      description: "We've made it fast and reliable.",
    },
    {
      id: 6,
      title: "Beautiful and modern",
      description: "We've made it beautiful and modern.",
    },
  ],
}
