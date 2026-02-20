import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
export function RevealEffectsChestBounceOpen() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-chest-bounce-container">
        <m.div 
            className="reveal-chest-bounce-wrapper"
            initial={{ scale: 1 }}
            animate={isOpen ? { scale: 1 } : { scale: [1, 1.1, 0.9, 1.05, 1] }}
            transition={{ duration: 0.6, times: [0, 0.4, 0.6, 0.8, 1] }}
        >
            <m.div 
                className="reveal-chest-bounce-lid"
                initial={{ rotateX: 0 }}
                animate={isOpen ? { rotateX: -120 } : { rotateX: 0 }}
                transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
            >
                <div className="reveal-chest-bounce-lid-top" />
                <div className="reveal-chest-bounce-lock" />
            </m.div>
            <div className="reveal-chest-bounce-base" />
            
            <m.div 
                className="reveal-chest-bounce-content"
                initial={{ y: 20, opacity: 0, scale: 0.5 }}
                animate={isOpen ? { y: -50, opacity: 1, scale: 1.2 } : { y: 20, opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
            >
                <span className="reveal-chest-bounce-icon">💰</span>
            </m.div>
        </m.div>
    </div>
  )
}
