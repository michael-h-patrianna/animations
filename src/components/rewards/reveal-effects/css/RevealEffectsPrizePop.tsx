import { useState, useEffect } from 'react'
import './RevealEffectsPrizePop.css'

/**
 *
 */
import { coinImage as coinImg } from '@/assets'
/**
 *
 */
export function RevealEffectsPrizePop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-prize-pop-container-css">
       {/* Shockwave Ripples */}
       <div className={`reveal-prize-pop-ripple-css ripple-1 ${isVisible ? 'active' : ''}`} />
       <div className={`reveal-prize-pop-ripple-css ripple-2 ${isVisible ? 'active' : ''}`} />

       {/* Main Prize */}
       <img 
         src={coinImg}
         alt="Reward"
         className={`reveal-prize-pop-item-css ${isVisible ? 'visible' : ''}`}
       />
    </div>
  )
}
