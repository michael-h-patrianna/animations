import { useEffect, useRef, useState } from 'react'
import './CollectionEffectsCoinMagnet.css'

import { coinImage } from '@/assets'
interface Coin {
  id: number
  startX: number
  startY: number
  rotation: number
  delay: number
}

/**
 *
 */
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
      className="coin-magnet-container"
      data-animation-id="collection-effects__coin-magnet"
    >
      <div className="coin-magnet-target" aria-hidden="true">
        {coins.map((coin) => {
          const translation = getTranslation(coin.startX, coin.startY)
          return (
            <div
              key={coin.id}
              className="coin-magnet-coin"
              style={{
                left: `${coin.startX}%`,
                top: `${coin.startY}%`,
                animationDelay: `${coin.delay}ms`,
                '--coin-rotation': `${coin.rotation}deg`,
                '--translate-x': `${translation.x}px`,
                '--translate-y': `${translation.y}px`,
              } as React.CSSProperties & {
                '--coin-rotation': string
                '--translate-x': string
                '--translate-y': string
              }}
              aria-hidden="true"
            >
              <img src={coinImage} alt="" className="coin-magnet-coin__image" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
