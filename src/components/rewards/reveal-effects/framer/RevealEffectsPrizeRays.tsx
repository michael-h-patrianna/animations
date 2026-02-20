import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

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
    <div className="reveal-prize-rays-container">
      {/* Rays background - Centered via x/y to avoid transform conflicts */}
      <m.div
        className="reveal-prize-rays-bg"
        initial={{ x: '-50%', y: '-50%', rotate: 0, opacity: 0 }}
        animate={{ 
          rotate: 360, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ 
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          opacity: { duration: 0.5 }
        }}
      />

      {/* Central Glow */}
      <m.div 
        className="reveal-prize-rays-glow"
        initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
        animate={isVisible ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
       
      {/* Prize Icon */}
      <m.img 
        src={diamondImg}
        alt="Prize"
        className="reveal-prize-rays-item"
        initial={{ scale: 0 }}
        animate={isVisible ? { scale: 1 } : { scale: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          mass: 1.2
        }}
      />
    </div>
  )
}
