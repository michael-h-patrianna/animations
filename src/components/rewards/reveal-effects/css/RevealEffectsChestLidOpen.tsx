import { useState, useEffect } from 'react'
import './RevealEffectsChestLidOpen.css'

/**
 *
 */
export function RevealEffectsChestLidOpen() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-chest-lid-container-css">
        <div className="reveal-chest-wrapper-css">
            <div className={`reveal-chest-lid-css ${isOpen ? 'open' : ''}`}>
                <div className="reveal-chest-lid-top-css" />
                <div className="reveal-chest-lock-css" />
            </div>
            <div className="reveal-chest-base-css" />
            
            <div className={`reveal-chest-content-css ${isOpen ? 'visible' : ''}`}>
                <span className="reveal-chest-icon-css">👑</span>
            </div>
        </div>
    </div>
  )
}
