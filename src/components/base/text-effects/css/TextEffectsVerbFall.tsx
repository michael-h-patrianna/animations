/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 */
import React from 'react'
import { memo } from 'react'
import './TextEffectsVerbFall.css'

function TextEffectsVerbFallComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  const STEP_DELAY = 0.05 // 50ms stagger per character

  return (
    <div className="verbFall" data-animation-id="text-effects__verb-falling" aria-label={text}>
      <div className="verbFall__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="verbFall__char"
            style={{ animationDelay: `${i * STEP_DELAY}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbFall to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbFall = memo(TextEffectsVerbFallComponent)


export default TextEffectsVerbFall

