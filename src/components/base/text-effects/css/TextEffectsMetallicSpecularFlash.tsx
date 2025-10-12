/**
 * Standalone: Copy this file and TextEffectsMetallicSpecularFlash.css into your app.
 * Runtime deps: react
 * RN parity: transforms/opacity/color only; pure CSS animations.
 */
import React from 'react'
import './TextEffectsMetallicSpecularFlash.css'

export function TextEffectsMetallicSpecularFlash() {
  const text = 'LORUM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div
      className="studioLogo-MetallicSpecularFlash"
      data-animation-id="text-effects__metallic-specular-flash"
      aria-label={text}
    >
      <div className="studioLogo-MetallicSpecularFlash__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="studioLogo-MetallicSpecularFlash__letter"
            style={{ animationDelay: `${0.05 + i * 0.02}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}


export default TextEffectsMetallicSpecularFlash

