import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
export function RevealEffectsPrizeFloatLand() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-prize-float-container">
       <m.div 
         className="reveal-prize-float-item"
         initial={{ y: -100, opacity: 0 }}
         animate={isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
         transition={{ type: "spring", damping: 12, stiffness: 100 }}
       >
         <span className="reveal-prize-float-icon">🎈</span>
       </m.div>
    </div>
  )
}
