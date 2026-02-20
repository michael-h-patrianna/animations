import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
export function RevealEffectsCardSlideUp() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-card-slide-up-container">
      <div className="reveal-card-slide-up-slot">
        <m.div
          className="reveal-card-common"
          initial={{ y: '100%', opacity: 0 }}
          animate={isVisible ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 12,
            stiffness: 100,
            mass: 0.8,
          }}
        >
          <div className="reveal-card-content">
            <span className="reveal-card-icon">💎</span>
            <span className="reveal-card-text">500 Gems</span>
          </div>
        </m.div>
      </div>
    </div>
  )
}
