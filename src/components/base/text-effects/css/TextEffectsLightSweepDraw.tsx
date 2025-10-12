/**
 * Standalone: Copy this file and TextEffectsLightSweepDraw.css into your app.
 * Runtime deps: react
 * RN parity: transforms/opacity/color only; pure CSS animations.
 */
import React from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsLightSweepDraw.css'

export function TextEffectsLightSweepDraw() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div
      className="studioLogo-LightSweepDraw"
      data-animation-id="text-effects__light-sweep-draw"
      aria-label={text}
    >
      <div className="studioLogo-LightSweepDraw__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="studioLogo-LightSweepDraw__letter"
            style={{ animationDelay: `${0.15 + i * 0.04}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}


export default TextEffectsLightSweepDraw

