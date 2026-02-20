import { useState, useEffect } from 'react'
import './RevealEffectsGiftBoxUnwrap.css'

export function RevealEffectsGiftBoxUnwrap() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-gift-box-container-css">
        <div className="reveal-gift-box-wrapper-css">
             <div className={`reveal-gift-box-lid-css ${isOpen ? 'open' : ''}`}>
                <div className="reveal-gift-box-lid-shape-css" />
                <div className="reveal-gift-box-bow-css" />
             </div>
             
             <div className="reveal-gift-box-base-css">
                 <div className={`reveal-gift-box-ribbon-v-css ${isOpen ? 'open' : ''}`} />
                 <div className="reveal-gift-box-ribbon-h-css" />
             </div>

             <div className={`reveal-gift-box-content-css ${isOpen ? 'visible' : ''}`}>
                 <span className="reveal-gift-box-icon-css">🎁</span>
             </div>
        </div>
    </div>
  )
}
