import { useState, useEffect } from 'react'
import './RevealEffectsCardShimmer.css'

/**
 *
 */
import { coinImage as coinImg } from '@/assets'
/**
 *
 */
export function RevealEffectsCardShimmer() {
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-card-shimmer-container-css">
      <div className={`reveal-card-shimmer-item-css ${isRevealed ? 'revealed' : ''}`}>
        <div className="reveal-card-shimmer-content-css">
            <img src={coinImg} alt="Coin" className="reveal-card-shimmer-img-css" />
            <span className="reveal-card-shimmer-label-css">500 Coins</span>
        </div>
        
        {/* Premium Shimmer Overlay */}
        <div className="reveal-card-shimmer-glare-css" />
      </div>
    </div>
  )
}
