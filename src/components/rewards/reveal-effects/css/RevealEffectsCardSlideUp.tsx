import { useState, useEffect } from 'react'
import './RevealEffectsCardSlideUp.css'

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
    <div className="reveal-card-slide-up-container-css">
      <div className="reveal-card-slide-up-slot-css">
        <div className={`reveal-card-common-css ${isVisible ? 'visible' : ''}`}>
          <div className="reveal-card-content-css">
            <span className="reveal-card-icon-css">💎</span>
            <span className="reveal-card-text-css">500 Gems</span>
          </div>
        </div>
      </div>
    </div>
  )
}
