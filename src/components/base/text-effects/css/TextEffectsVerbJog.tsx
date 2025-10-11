/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 */
import React from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsVerbJog.css'

export function TextEffectsVerbJog() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbJog" data-animation-id="text-effects__verb-jogging" aria-label={text}>
      <div className="verbJog__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`verbJog__char ${i % 2 === 0 ? 'verbJog__char--delayed' : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-jogging',
  title: 'Jogging',
  description: 'Energetic jog rhythm alternating between letters.',
  tags: ['css'],
  disableReplay: false
}

export default TextEffectsVerbJog
