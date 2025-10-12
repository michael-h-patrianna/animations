/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 */
import React from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsVerbJump.css'

export function TextEffectsVerbJump() {
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


export default TextEffectsVerbJump

