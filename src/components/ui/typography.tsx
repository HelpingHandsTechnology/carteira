import { cn } from "@/lib/utils"

export function TypographyH1(props: any) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", props.className)}>
      {props.children}
    </h1>
  )
}
export function TypographyH2(props: any) {
  return (
    <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", props.className)}>
      {props.children}
    </h2>
  )
}

export function TypographyH3(props: any) {
  return <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", props.className)}>{props.children}</h3>
}

export function TypographyH4(props: any) {
  return <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", props.className)}>{props.children}</h4>
}

export function TypographyP(props: any) {
  return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)}>{props.children}</p>
}
export function TypographyLead(props: any) {
  return <p className={cn("text-xl text-muted-foreground", props.className)}>{props.children}</p>
}
export function TypographyLarge(props: any) {
  return <div className={cn("text-lg font-semibold", props.className)}> {props.children}</div>
}
export function TypographySmall(props: any) {
  return <p className={cn("text-sm font-medium leading-none", props.className)}>{props.children}</p>
}
export function TypographyMuted(props: any) {
  return <p className={cn("text-sm text-muted-foreground", props.className)}> {props.children}</p>
}
