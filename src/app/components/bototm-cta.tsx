"use client"

import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TypographyH1 } from "@/components/ui/typography"
import Link from "next/link"
import { RainbowButton } from "./rainbow-button"
import { useRef } from "react"

export function BottomCtaSection({ title = CONTENT.title }: { title?: string }) {
  const words = title.split(" ")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      className={cn(
        "relative min-h-[50vh] w-full",
        "flex items-center justify-center",
        "overflow-hidden",
        "bg-white dark:bg-neutral-950"
      )}
    >
      <div className="absolute inset-0">
        <FloatingPaths position={1} isInView={isInView} />
        <FloatingPaths position={-1} isInView={isInView} />
      </div>

      <div className={cn("relative z-10 container mx-auto", "px-4 md:px-6", "text-center")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <TypographyH1 className={cn("text-2xl sm:text-4xl md:text-5xl", "mb-8", "tracking-tighter")}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-4 last:mr-0">
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                    transition={{
                      delay: isInView ? wordIndex * 0.1 + letterIndex * 0.03 : 0,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                    className={cn(
                      "inline-block md:py-1",
                      "text-transparent bg-clip-text",
                      "bg-gradient-to-r from-neutral-900 to-neutral-700/80",
                      "dark:from-white dark:to-white/80"
                    )}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </TypographyH1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              "inline-block group relative",
              "p-px rounded-2xl",
              "overflow-hidden",
              "shadow-lg hover:shadow-xl",
              "transition-shadow duration-300"
            )}
          >
            <Link href="/login">
              <RainbowButton>{CONTENT.buttonText}</RainbowButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function FloatingPaths({ position, isInView }: { position: number; isInView: boolean }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${
      312 - i * 5 * position
    } ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-slate-950 dark:text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0 }}
            animate={
              isInView
                ? {
                    pathLength: 1,
                    opacity: [0.3, 0.6, 0.3],
                    pathOffset: [0, 1, 0],
                  }
                : { pathLength: 0.3, opacity: 0 }
            }
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: isInView ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

const CONTENT = {
  title: "Evite Dor de Cabeça: Organize e Divida Custos em Segurança.",
  buttonText: "Comece agora",
}
