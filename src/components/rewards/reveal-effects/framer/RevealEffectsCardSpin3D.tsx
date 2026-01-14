import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import './RevealEffectsCardSpin3D.css'

export const metadata = {
  id: 'rewards-reveal-effects__card-spin-3d',
  title: 'Card Spin 3D',
  description: 'A card spins 360 degrees on the Y-axis while scaling up.',
  tags: ['card', 'spin', '3d', 'reveal'],
}

export function RevealEffectsCardSpin3D() {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-card-spin-container">
      <m.div
        className="reveal-card-spin-card"
        initial={{ rotateY: 90, scale: 0.5, opacity: 0 }}
        animate={isRevealed ? { rotateY: 0, scale: 1, opacity: 1 } : { rotateY: 90, scale: 0.5, opacity: 0 }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 80,
          mass: 1,
          duration: 0.8
        }}
      >
        <div className="reveal-card-spin-inner">
          <span className="reveal-card-spin-icon">🃏</span>
          <span className="reveal-card-spin-text">Rare Item</span>
        </div>
      </m.div>
    </div>
  )
}
