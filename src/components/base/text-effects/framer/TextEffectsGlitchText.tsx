import { memo } from 'react'

import * as m from 'motion/react-m'

import '../shared.css'
import './TextEffectsGlitchText.css'

function TextEffectsGlitchTextComponent() {
  const text = 'SYSTEM ERROR'

  return (
    <div className="tfx-glitchtext-container" data-animation-id="text-effects__tfx-glitchtext">
      {/* Main text */}
      <m.div
        className="tfx-glitchtext-base"
        animate={{ x: [0, -2, 0, 2, 0, -1, 0, 1, 0], scaleX: [1, 1, 1.02, 1, 0.98, 1, 1.01, 1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const, times: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1] }}
      >
        {text}
      </m.div>

      {/* RGB offset layers (no text-shadow/filter) */}
      <m.div
        className="tfx-glitchtext-layer tfx-glitchlayer-1"
        animate={{ x: [0, -1, 0, 1, 0], skewX: [0, 3, 0, -2, 0], opacity: [0.6, 0.8, 0.4, 0.7, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const }}
      >
        {text}
      </m.div>
      <m.div
        className="tfx-glitchtext-layer tfx-glitchlayer-2"
        animate={{ x: [0, 1, 0, -1, 0], skewX: [0, -2, 0, 3, 0], opacity: [0.6, 0.7, 0.5, 0.8, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const }}
      >
        {text}
      </m.div>

      {/* Distortion bars */}
      <m.div
        className="tfx-glitchbars"
        animate={{ opacity: [0, 0.8, 0, 0.9, 0, 0.6, 0], scaleY: [1, 1.5, 1, 2, 1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'linear' as const }}
      />
    </div>
  )
}

/**
 * Memoized TextEffectsGlitchText to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsGlitchText = memo(TextEffectsGlitchTextComponent)


