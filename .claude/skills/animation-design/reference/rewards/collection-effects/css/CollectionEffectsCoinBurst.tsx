import { useEffect, useState } from 'react'
import './CollectionEffectsCoinBurst.css'

interface Coin {
  id: number
  x: number
  y: number
  rotation: number
  delay: number
}

export function CollectionEffectsCoinBurst() {
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

    setCoins(generatedCoins)

    // Clean up after animation completes
    // Container anticipation: 80ms
    // Coin pop-in: 100ms
    // Burst travel: 700ms
    // Fade exit: 400ms (overlaps with travel)
    // Total: 80 + 100 + 700 = 880ms + max delay (13 * 5 = 65ms) = 945ms
    // Add buffer for fade exit: 945 + 400 = 1345ms
    const cleanup = setTimeout(() => {
      setCoins([])
    }, 1400)

    return () => clearTimeout(cleanup)
  }, [])

  return (
    <div
      className="coin-burst-container"
      data-animation-id="collection-effects__coin-burst"
    >
      <div className="coin-burst-stage" aria-hidden="true">
        {coins.map((coin) => (
          <div
            key={coin.id}
            className="coin-burst-coin"
            style={{
              animationDelay: `${coin.delay}ms`,
              '--coin-x': `${coin.x}px`,
              '--coin-y': `${coin.y}px`,
              '--coin-rotation': `${coin.rotation}deg`,
            } as React.CSSProperties & {
              '--coin-x': string
              '--coin-y': string
              '--coin-rotation': string
            }}
            aria-hidden="true"
          >
            <div className="coin-burst-coin__inner">$</div>
          </div>
        ))}
      </div>
    </div>
  )
}
