import { useState, useEffect } from 'react'
import './RevealEffectsCardFan.css'

export function RevealEffectsCardFan() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const cards = [
    { id: 1, color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: '⭐' },
    { id: 2, color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', icon: '🌟' },
    { id: 3, color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', icon: '✨' },
  ]

  return (
    <div className="reveal-card-fan-container-css">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`reveal-card-fan-item-css card-${index + 1} ${isOpen ? 'open' : ''}`}
          style={{ 
            background: card.color,
            zIndex: index === 1 ? 10 : 1 
          }}
        >
           <span className="reveal-card-fan-icon-css">{card.icon}</span>
        </div>
      ))}
    </div>
  )
}
