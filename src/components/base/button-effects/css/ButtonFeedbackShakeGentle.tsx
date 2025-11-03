import { memo, useState } from 'react'
import './ButtonFeedbackShakeGentle.css'

function ButtonFeedbackShakeGentleComponent() {
const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <div
      className="button-demo"
      data-animation-id="bxf-feedback__shake-gentle"
    >
        <button
          className={`pf-btn pf-btn--primary bxf-feedback-shake-button ${isAnimating ? 'bxf-feedback-shake-button--active' : ''}`}
          onClick={handleClick}
          aria-label="Insufficient funds"
          aria-live="polite"

        >
          Click Me
        </button>
    </div>
  )
}

export const ButtonFeedbackShakeGentle = memo(ButtonFeedbackShakeGentleComponent)
