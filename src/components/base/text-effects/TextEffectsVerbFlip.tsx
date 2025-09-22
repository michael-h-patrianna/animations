/**
 * Standalone: Copy this file and TextEffectsVerbFlip.css into your app.
 */
import React from 'react'
import './TextEffectsVerbFlip.css'

export function TextEffectsVerbFlip() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])
  return (
    <div className="verbFlip" data-animation-id="text-effects__verb-flipping" aria-label={text}>
      <div className="verbFlip__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="verbFlip__char">
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TextEffectsVerbFlip
