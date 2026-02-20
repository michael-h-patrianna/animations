import { useState, useEffect } from 'react'
import './RevealEffectsCardSpin3D.css'

/**
 *
 */
export function RevealEffectsCardSpin3D() {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-card-spin-container-css">
      <div className={`reveal-card-spin-card-css ${isRevealed ? 'revealed' : ''}`}>
        <div className="reveal-card-spin-inner-css">
          <span className="reveal-card-spin-icon-css">🃏</span>
          <span className="reveal-card-spin-text-css">Rare Item</span>
        </div>
      </div>
    </div>
  )
}
