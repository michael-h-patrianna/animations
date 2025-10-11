/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 */
import React from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsVerbFall.css'

export function TextEffectsVerbFall() {
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

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-falling',
  title: 'Falling',
  description: 'Letters drop and settle with a soft bounce.',
  tags: ['css'],
  disableReplay: false
}

export default TextEffectsVerbFall
