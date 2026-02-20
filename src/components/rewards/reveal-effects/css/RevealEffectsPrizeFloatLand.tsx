import { useState, useEffect } from 'react'
import './RevealEffectsPrizeFloatLand.css'

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
    <div className="reveal-prize-float-container-css">
       <div className={`reveal-prize-float-item-css ${isVisible ? 'visible' : ''}`}>
         <span className="reveal-prize-float-icon-css">🎈</span>
       </div>
    </div>
  )
}
