/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react
 * RN parity: Pure CSS animations - port keyframes to Reanimated.
 */
import React from 'react'
import { memo } from 'react'
import './TextEffectsVerbFloat.css'

function TextEffectsVerbFloatComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbFloat" data-animation-id="text-effects__verb-floating" aria-label={text}>
      <div className="verbFloat__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`verbFloat__char ${i % 2 === 1 ? 'verbFloat__char--delayed' : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbFloat to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbFloat = memo(TextEffectsVerbFloatComponent)


export default TextEffectsVerbFloat

