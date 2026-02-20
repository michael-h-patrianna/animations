/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import React from 'react'
import { memo } from 'react'

function TextEffectsVerbTwirlComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbTwirl" data-animation-id="text-effects__verb-twirling" aria-label={text}>
      <div className="verbTwirl__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="verbTwirl__char"
            initial={{ rotate: 0, scale: 1 }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 1, 0.98, 1]
            }}
            transition={{
              duration: 1.8,
              ease: easeInOut,
              times: [0, 0.25, 0.5, 0.75, 1],
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
 * Memoized TextEffectsVerbTwirl to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbTwirl = memo(TextEffectsVerbTwirlComponent)

export default TextEffectsVerbTwirl
