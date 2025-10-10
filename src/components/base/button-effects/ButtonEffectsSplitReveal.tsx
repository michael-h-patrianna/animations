import { useState } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './ButtonEffectsSplitReveal.css'
import './shared.css'

export function ButtonEffectsSplitReveal() {
  const [isRevealing, setIsRevealing] = useState(false)

  const handleClick = () => {
    setIsRevealing(true)
    setTimeout(() => setIsRevealing(false), 800)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__split-reveal">
      <button
        className={`pf-btn pf-btn--primary pf-btn--split-reveal ${isRevealing ? 'split-revealing' : ''}`}
        onClick={handleClick}
      >
        <span className="pf-btn__split-top">Click</span>
        <span className="pf-btn__split-bottom">Me!</span>
        <span className="pf-btn__split-reveal-content">✨</span>
      </button>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'button-effects__split-reveal',
  title: 'Split Reveal',
  description: 'Button splits open to reveal content/color underneath.',
  tags: ['css', 'js'],
  disableReplay: true,
}
