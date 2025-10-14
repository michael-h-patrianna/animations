/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 */
import React from 'react'
import { memo } from 'react'
import './TextEffectsVerbJump.css'

function TextEffectsVerbJumpComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  const STEP_DELAY = 0.06 // 60ms stagger per character

  return (
    <div className="verbJump" data-animation-id="text-effects__verb-jumping" aria-label={text}>
      <div className="verbJump__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="verbJump__char"
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
 * Memoized TextEffectsVerbJump to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbJump = memo(TextEffectsVerbJumpComponent)


export default TextEffectsVerbJump

