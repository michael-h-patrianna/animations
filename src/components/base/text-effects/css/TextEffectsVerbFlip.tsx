/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 * Note: In RN, perspective should be applied inline on the animated element.
 */
import React from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsVerbFlip.css'

export function TextEffectsVerbFlip() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbFlip" data-animation-id="text-effects__verb-flipping" aria-label={text}>
      <div className="verbFlip__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`verbFlip__char ${i % 2 === 1 ? 'verbFlip__char--delayed' : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-flipping',
  title: 'Flipping',
  description: '3D flip rotation with perspective for each character.',
  tags: ['css'],
  disableReplay: false
}

export default TextEffectsVerbFlip
