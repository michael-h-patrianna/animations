import { useState, useEffect } from 'react'
import './RevealEffectsChestBounceOpen.css'

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
    <div className="reveal-chest-bounce-container-css">
        <div className={`reveal-chest-bounce-wrapper-css ${!isOpen ? 'bouncing' : ''}`}>
            <div className={`reveal-chest-bounce-lid-css ${isOpen ? 'open' : ''}`}>
                <div className="reveal-chest-bounce-lid-top-css" />
                <div className="reveal-chest-bounce-lock-css" />
            </div>
            <div className="reveal-chest-bounce-base-css" />
            
            <div className={`reveal-chest-bounce-content-css ${isOpen ? 'visible' : ''}`}>
                <span className="reveal-chest-bounce-icon-css">💰</span>
            </div>
        </div>
    </div>
  )
}
