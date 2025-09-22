/**
 * Standalone: Copy this file and TextEffectsVerbFall.css into your app.
 */
import React from 'react'
import './TextEffectsCharIndexDelays.css'
import './TextEffectsVerbFall.css'

export function TextEffectsVerbFall() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])
  return (
    <div className="verbFall" data-animation-id="text-effects__verb-falling" aria-label={text}>
      <div className="verbFall__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className={`verbFall__char i-${i}`}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TextEffectsVerbFall
