"use client"

import React, { useCallback, useEffect, useMemo, useState, type SVGProps } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface Logo {
  name: string
  id: number
  img: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface LogoColumnProps {
  logos: Logo[]
  index: number
  currentTime: number
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp!
  }
  return shuffled
}

const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  if (allLogos.length === 0) return Array.from({ length: columnCount }, () => [])

  // Determina quantos logos queremos por coluna (pelo menos 4)
  const logosPerColumn = Math.max(4, Math.ceil(allLogos.length / columnCount))

  // Cria um array com logos suficientes para todas as colunas
  let extendedLogos: Logo[] = []
  while (extendedLogos.length < logosPerColumn * columnCount) {
    extendedLogos = [...extendedLogos, ...allLogos]
  }

  // Embaralha todos os logos
  extendedLogos = shuffleArray(extendedLogos)

  // Cria as colunas
  const columns: Logo[][] = []
  for (let i = 0; i < columnCount; i++) {
    // Pega uma fatia dos logos para esta coluna
    const columnLogos = extendedLogos.slice(i * logosPerColumn, (i + 1) * logosPerColumn)

    // Garante que temos exatamente logosPerColumn logos
    while (columnLogos.length < logosPerColumn) {
      columnLogos.push(allLogos[Math.floor(Math.random() * allLogos.length)]!)
    }

    // Embaralha novamente para evitar padrões
    columns.push(shuffleArray(columnLogos))
  }

  return columns
}

const LogoColumn: React.FC<LogoColumnProps> = React.memo(({ logos, index, currentTime }) => {
  const cycleInterval = 2000
  const columnDelay = index * 200
  const totalDuration = cycleInterval * logos.length
  const adjustedTime = (currentTime + columnDelay) % totalDuration
  const currentIndex = Math.floor(adjustedTime / cycleInterval) % logos.length
  const CurrentLogo = useMemo(() => logos[currentIndex]?.img, [logos, currentIndex])

  return (
    <motion.div
      className="relative h-14 w-24 overflow-hidden md:h-24 md:w-48 "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${logos[currentIndex]?.id}-${currentIndex}`}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "10%", opacity: 0 }}
          animate={{
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 1,
              bounce: 0.2,
              duration: 0.5,
            },
          }}
          exit={{
            y: "-20%",
            opacity: 0,
            filter: "blur(6px)",
            transition: {
              type: "tween",
              ease: "easeIn",
              duration: 0.3,
            },
          }}
        >
          {CurrentLogo && <CurrentLogo className="md:w-24 md:h-24 py-2" />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
})

interface LogoCarouselProps {
  columnCount?: number
  logos: Logo[]
}

export function LogoCarousel({ columnCount = 2, logos }: LogoCarouselProps) {
  const [logoSets, setLogoSets] = useState<Logo[][]>([])
  const [currentTime, setCurrentTime] = useState(0)

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(updateTime, 100)
    return () => clearInterval(intervalId)
  }, [updateTime])

  useEffect(() => {
    const distributedLogos = distributeLogos(logos, columnCount)
    setLogoSets(distributedLogos)
  }, [logos, columnCount])

  return (
    <div className="flex space-x-4 ">
      {logoSets.map((logos, index) => (
        <LogoColumn key={index} logos={logos} index={index} currentTime={currentTime} />
      ))}
    </div>
  )
}
