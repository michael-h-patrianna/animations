import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
export function RevealEffectsCardFan() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const cards = [
    { id: 1, rotate: -15, x: -60, color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: '⭐' },
    { id: 2, rotate: 0, x: 0, color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', icon: '🌟' },
    { id: 3, rotate: 15, x: 60, color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', icon: '✨' },
  ]

  return (
    <div className="reveal-card-fan-container">
      {cards.map((card, index) => (
        <m.div
          key={card.id}
          className="reveal-card-fan-item"
          style={{ 
            background: card.color,
            zIndex: index === 1 ? 10 : 1 
          }}
          initial={{ rotate: 0, x: 0, scale: 0.8, opacity: 0 }}
          animate={isOpen ? { 
            rotate: card.rotate, 
            x: card.x, 
            scale: 1,
            opacity: 1
          } : { 
            rotate: 0, 
            x: 0, 
            scale: 0.8,
            opacity: 0
          }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 120,
            delay: index * 0.1
          }}
        >
           <span className="reveal-card-fan-icon">{card.icon}</span>
        </m.div>
      ))}
    </div>
  )
}
