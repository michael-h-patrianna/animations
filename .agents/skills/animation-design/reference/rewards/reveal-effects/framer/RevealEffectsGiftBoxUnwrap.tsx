import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import './RevealEffectsGiftBoxUnwrap.css'

export const metadata = {
  id: 'rewards-reveal-effects__gift-box-unwrap',
  title: 'Gift Box Unwrap',
  description: 'Gift box lid lifts up and ribbon fades away.',
  tags: ['gift', 'box', 'unwrap', 'reveal'],
}

export function RevealEffectsGiftBoxUnwrap() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-gift-box-container">
        <div className="reveal-gift-box-wrapper">
             <m.div 
                className="reveal-gift-box-lid"
                animate={isOpen ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
             >
                <div className="reveal-gift-box-lid-shape" />
                <div className="reveal-gift-box-bow" />
             </m.div>
             
             <div className="reveal-gift-box-base">
                 <m.div 
                    className="reveal-gift-box-ribbon-v" 
                    animate={isOpen ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
                 />
                 <div className="reveal-gift-box-ribbon-h" />
             </div>

             <m.div 
                className="reveal-gift-box-content"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={isOpen ? { scale: 1.2, opacity: 1, y: -20 } : { scale: 0.5, opacity: 0, y: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
             >
                 <span className="reveal-gift-box-icon">🎁</span>
             </m.div>
        </div>
    </div>
  )
}
