import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'
import './RevealEffectsChestLidOpen.css'

export const metadata = {
  id: 'rewards-reveal-effects__chest-lid-open',
  title: 'Chest Lid Open',
  description: 'Standard treasure chest opening animation.',
  tags: ['chest', 'open', 'lid', 'reveal'],
}

export function RevealEffectsChestLidOpen() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="reveal-chest-lid-container">
        <div className="reveal-chest-wrapper">
            <m.div 
                className="reveal-chest-lid"
                initial={{ rotateX: 0 }}
                animate={isOpen ? { rotateX: -110 } : { rotateX: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.25 }}
            >
                <div className="reveal-chest-lid-top" />
                <div className="reveal-chest-lock" />
            </m.div>
            <div className="reveal-chest-base" />
            
            <m.div 
                className="reveal-chest-content"
                initial={{ y: 20, opacity: 0, scale: 0.5 }}
                animate={isOpen ? { y: -40, opacity: 1, scale: 1 } : { y: 20, opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <span className="reveal-chest-icon">👑</span>
            </m.div>
        </div>
    </div>
  )
}
