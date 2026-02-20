/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import React from 'react'
import { memo } from 'react'

function TextEffectsVerbFallComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  const STEP_DELAY = 0.05 // 50ms stagger per character

  return (
    <div className="verbFall" data-animation-id="text-effects__verb-falling" aria-label={text}>
      <div className="verbFall__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="verbFall__char"
            initial={{ y: -12, scaleY: 0.96, opacity: 0.9 }}
            animate={{
              y: [-12, 0, 4, 0],
              scaleY: [0.96, 1.02, 0.98, 1],
              opacity: [0.9, 1, 1, 1]
            }}
            transition={{
              duration: 1.6,
              delay: i * STEP_DELAY,
              ease: easeInOut,
              times: [0, 0.3, 0.6, 1],
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbFall to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbFall = memo(TextEffectsVerbFallComponent)

export default TextEffectsVerbFall
