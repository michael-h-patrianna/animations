import { useState, useEffect } from 'react'
import './RevealEffectsCardFlipSmooth.css'

export function RevealEffectsCardFlipSmooth() {
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    // Trigger flip animation after mount
    const flipTimer = setTimeout(() => {
      setIsFlipped(true)
    }, 100)

    return () => clearTimeout(flipTimer)
  }, [])

  return (
    <div
      className="card-flip-container"
      data-animation-id="reveal-effects__card-flip-smooth"
    >
      <div
        className={`card-flip-card ${isFlipped ? 'card-flip-card--flipped' : ''}`}
        aria-label={isFlipped ? 'Reward revealed: 100 coins' : 'Mystery reward card'}
      >
        {/* Front face - Mystery */}
        <div className="card-flip-face card-flip-face--front">
          <div className="card-flip-content">
            <div className="card-flip-mystery-icon">?</div>
            <div className="card-flip-mystery-text">Mystery</div>
          </div>
        </div>

        {/* Back face - Revealed */}
        <div className="card-flip-face card-flip-face--back">
          <div className="card-flip-content">
            <div className="card-flip-reward-icon">$</div>
            <div className="card-flip-reward-text">100</div>
            <div className="card-flip-reward-label">Coins</div>
          </div>
        </div>
      </div>
    </div>
  )
}
