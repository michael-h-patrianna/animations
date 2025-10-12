import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsGlitchText.css'

export function TextEffectsGlitchText() {
  const text = 'SYSTEM ERROR'

  return (
    <div className="glitch-text-container" data-animation-id="text-effects__glitch-text">
      {/* Main text */}
      <div className="glitch-text-base">
        {text}
      </div>

      {/* RGB offset layers (no text-shadow/filter) */}
      <div className="glitch-text-layer glitch-layer-1">
        {text}
      </div>
      <div className="glitch-text-layer glitch-layer-2">
        {text}
      </div>

      {/* Distortion bars */}
      <div className="glitch-bars" />
    </div>
  )
}

