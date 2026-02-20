import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

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
    <div className="reveal-card-shimmer-container">
      <m.div
        className="reveal-card-shimmer-item"
        initial={{ opacity: 0, y: 30 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="reveal-card-shimmer-content">
            <img src={coinImg} alt="Coin" className="reveal-card-shimmer-img" />
            <span className="reveal-card-shimmer-label">500 Coins</span>
        </div>
        
        {/* Premium Shimmer Overlay */}
        <m.div 
            className="reveal-card-shimmer-glare"
            initial={{ x: '-150%' }}
            animate={isRevealed ? { x: '150%' } : { x: '-150%' }}
            transition={{ 
                delay: 0.4, 
                duration: 1.5, 
                ease: "easeInOut", 
                repeat: Infinity, 
                repeatDelay: 3 
            }}
        />
      </m.div>
    </div>
  )
}
