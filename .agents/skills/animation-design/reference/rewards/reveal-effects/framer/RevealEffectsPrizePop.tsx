import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import coinImg from '@/assets/coin.png'
import './RevealEffectsPrizePop.css'

export function RevealEffectsPrizePop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-prize-pop-container">
       {/* Shockwave Ripples */}
       {[0, 0.15].map((delay, i) => (
         <m.div
            key={i}
            className="reveal-prize-pop-ripple"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={isVisible ? { scale: 2.5, opacity: 0 } : { scale: 0, opacity: 0.5 }}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
         />
       ))}

       {/* Main Prize */}
       <m.img 
         src={coinImg}
         alt="Reward"
         className="reveal-prize-pop-item"
         initial={{ scale: 0 }}
         animate={isVisible ? { scale: 1 } : { scale: 0 }}
         transition={{ 
           type: "spring", 
           stiffness: 400, 
           damping: 15 
         }}
       />
    </div>
  )
}
