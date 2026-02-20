import { useState, useEffect } from 'react'
import './RevealEffectsPrizeRays.css'

/**
 *
 */
import { diamondImage as diamondImg } from '@/assets'
/**
 *
 */
export function RevealEffectsPrizeRays() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-prize-rays-container-css">
      {/* Rays background - Centered via CSS transform */}
      <div 
        className={`reveal-prize-rays-bg-css ${isVisible ? 'visible' : ''}`}
      />

      {/* Central Glow */}
      <div 
        className={`reveal-prize-rays-glow-css ${isVisible ? 'visible' : ''}`}
      />
       
      {/* Prize Icon */}
      <img 
        src={diamondImg}
        alt="Prize"
        className={`reveal-prize-rays-item-css ${isVisible ? 'visible' : ''}`}
      />
    </div>
  )
}
