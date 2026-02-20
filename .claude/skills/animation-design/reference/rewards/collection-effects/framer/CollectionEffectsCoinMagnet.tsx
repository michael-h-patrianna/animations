import { useEffect, useRef, useState } from 'react'
import * as m from 'motion/react-m'
import coinImage from '@/assets/coin.png'
import './CollectionEffectsCoinMagnet.css'

interface Coin {
  id: number
  startX: number
  startY: number
  rotation: number
  delay: number
}

export function CollectionEffectsCoinMagnet() {
  const [coins, setCoins] = useState<Coin[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate 10 coins with random start positions
    const generatedCoins: Coin[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      startX: 10 + Math.random() * 80, // 10-90%
      startY: 10 + Math.random() * 80, // 10-90%
      rotation: 8 + Math.random() * 7, // 8-15 degrees
      delay: i * 60, // 60ms stagger
    }))

    setCoins(generatedCoins)

    // Clean up coins after animation completes
    // Duration: 1000ms + max delay (9 * 60 = 540ms) = 1540ms
    const cleanup = setTimeout(() => {
      setCoins([])
    }, 1600)

    return () => clearTimeout(cleanup)
  }, [])

  // Calculate translation needed to reach target from each coin's start position
  const getTranslation = (startX: number, startY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 }

    const containerWidth = containerRef.current.offsetWidth
    const containerHeight = containerRef.current.offsetHeight

    // Target is at right: 40px, top: 40px from container edges
    const targetX = containerWidth - 40
    const targetY = 40

    // Start position in pixels
    const startXPx = (startX / 100) * containerWidth
    const startYPx = (startY / 100) * containerHeight

    // Calculate delta
    return {
      x: targetX - startXPx,
      y: targetY - startYPx,
    }
  }

  return (
    <div
      ref={containerRef}
      className="coin-magnet-container-framer"
      data-animation-id="collection-effects__coin-magnet"
    >
      <div className="coin-magnet-target" aria-hidden="true">
        {coins.map((coin) => {
          const translation = getTranslation(coin.startX, coin.startY)
          const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches

          return (
            <m.div
              key={coin.id}
              className="coin-magnet-coin-framer"
              style={{
                left: `${coin.startX}%`,
                top: `${coin.startY}%`,
              }}
              initial={{
                x: '-50%',
                y: '-50%',
                scale: prefersReducedMotion ? 0.8 : 1,
                rotate: 0,
                opacity: prefersReducedMotion ? 0 : 0.8,
              }}
              animate={
                prefersReducedMotion
                  ? {
                      x: `calc(-50% + ${translation.x}px)`,
                      y: `calc(-50% + ${translation.y}px)`,
                      scale: [0.8, 1, 1, 0.8],
                      opacity: [0, 1, 1, 0],
                    }
                  : {
                      x: `calc(-50% + ${translation.x}px)`,
                      y: `calc(-50% + ${translation.y}px)`,
                      scale: [1, 1.2, 0.8],
                      rotate: [0, coin.rotation * 0.5, coin.rotation],
                      opacity: [0.8, 1, 1, 0],
                    }
              }
              transition={{
                duration: 1,
                delay: coin.delay / 1000,
                ease: [0.4, 0.0, 0.2, 1] as const,
                times: prefersReducedMotion ? [0, 0.3, 0.7, 1] : [0, 0.5, 1],
              }}
              aria-hidden="true"
            >
              <img src={coinImage} alt="" className="coin-magnet-coin__image" />
            </m.div>
          )
        })}
      </div>
    </div>
  )
}
