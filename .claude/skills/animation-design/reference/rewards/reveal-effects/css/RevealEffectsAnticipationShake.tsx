import { useEffect, useState } from 'react'
import './RevealEffectsAnticipationShake.css'

export function RevealEffectsAnticipationShake() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Delay animation start to ensure smooth mount transition
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="anticipation-shake-container"
      data-animation-id="reveal-effects__anticipation-shake"
    >
      <div
        className={`anticipation-shake-box ${isAnimating ? 'anticipation-shake-box--active' : ''}`}
        aria-label="Mystery reward box building anticipation"
      >
        <div className="anticipation-shake-content" aria-hidden="true">
          <div className="anticipation-shake-icon">?</div>
        </div>
      </div>
    </div>
  )
}
