import { useEffect, useState } from 'react'
import * as m from 'motion/react-m'
interface Coin {
  id: number
  x: number
  y: number
  rotation: number
  delay: number
}
/**
 *
 */ export function CollectionEffectsCoinBurst() {
  const [coins, setCoins] = useState<Coin[]>([])
  useEffect(() => {
    // Generate 14 coins in radial pattern
    const totalCoins = 14
    const generatedCoins: Coin[] = Array.from({ length: totalCoins }, (_, i) => {
      const angle = (i / totalCoins) * Math.PI * 2
      const distance = 120 + Math.random() * 60 // 120-180px
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      const rotation = Math.random() * 180
      return {
        id: i,
        x,
        y,
        rotation,
        delay: i * 5, // 5ms stagger
      }
    })
    setCoins(generatedCoins) // Clean up after animation completes
    const cleanup = setTimeout(() => {
      setCoins([])
    }, 1400)
    return () => clearTimeout(cleanup)
  }, [])
  const prefersReducedMotion = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    <div className="coin-burst-container-framer" data-animation-id="collection-effects__coin-burst">
      <m.div className="coin-burst-stage-framer" initial={{ scale: 1 }} animate={prefersReducedMotion ? { scale: 1 } : { scale: 0.8 }} transition={{ duration: 0.08, ease: [0.4, 0, 0.6, 1] as const }} aria-hidden="true">
        {coins.map((coin) => (
          <m.div
            key={coin.id}
            className="coin-burst-coin-framer"
            initial={{ x: '-50%', y: '-50%', scale: 0, rotate: 0, opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { x: '-50%', y: '-50%', scale: [0, 1, 1, 0], rotate: 0, opacity: [0, 1, 1, 0] }
                : { x: `calc(-50% + ${coin.x}px)`, y: `calc(-50% + ${coin.y}px)`, scale: [0, 1.2, 1, 1, 0.6], rotate: [0, 0, 0, coin.rotation, coin.rotation], opacity: [0, 1, 1, 1, 0] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.3, delay: coin.delay / 1000, ease: 'easeOut' as const, times: [0, 0.33, 0.67, 1] }
                : {
                    duration: 1.2,
                    delay: coin.delay / 1000,
                    ease: [0.2, 0.8, 0.3, 1] as const,
                    times: [0, 0.083, 0.167, 0.75, 1],
                    scale: { times: [0, 0.083, 0.167, 0.75, 1], duration: 1.2 },
                    rotate: { times: [0, 0.083, 0.167, 0.75, 1], duration: 1.2 },
                    opacity: { times: [0, 0.083, 0.167, 0.75, 1], duration: 1.2 },
                  }
            }
            aria-hidden="true"
          >
            <div className="coin-burst-coin__inner">$</div>
          </m.div>
        ))}
      </m.div>
    </div>
  )
}
