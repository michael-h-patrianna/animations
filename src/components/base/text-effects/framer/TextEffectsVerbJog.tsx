/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import React from 'react'
import { memo } from 'react'
import './TextEffectsVerbJog.css'
import '../shared.css'

function TextEffectsVerbJogComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbJog" data-animation-id="text-effects__verb-jogging" aria-label={text}>
      <div className="verbJog__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="verbJog__char"
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [0, -6, 0, -2, 0],
              rotate: [0, -4, 2, -2, 0]
            }}
            transition={{
              duration: 1.2,
              delay: i % 2 === 0 ? 0.15 : 0, // even indices get delay (alternating legs)
              ease: easeInOut,
              times: [0, 0.2, 0.4, 0.6, 1],
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
 * Memoized TextEffectsVerbJog to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbJog = memo(TextEffectsVerbJogComponent)



export default TextEffectsVerbJog
