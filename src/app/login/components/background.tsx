import { cn } from "@/lib/utils"

export function Background() {
  return (
    <div className="fixed inset-0 -z-10">
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-br from-primary/30 via-background to-secondary/30",
          "opacity-50"
        )}
      />
      <div
        className={cn(
          "absolute inset-0",
          "bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]",
          "bg-[size:14px_24px]"
        )}
      />
    </div>
  )
}
