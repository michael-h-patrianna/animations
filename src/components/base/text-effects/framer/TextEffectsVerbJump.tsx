/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import React from 'react'
import { memo } from 'react'

function TextEffectsVerbJumpComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  const STEP_DELAY = 0.06 // 60ms stagger per character

  return (
    <div className="verbJump" data-animation-id="text-effects__verb-jumping" aria-label={text}>
      <div className="verbJump__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="verbJump__char"
            initial={{ y: 0, scaleY: 1 }}
            animate={{
              y: [0, -10, 0, -4, 0],
              scaleY: [1, 0.96, 1.02, 0.98, 1]
            }}
            transition={{
              duration: 1.6,
              delay: i * STEP_DELAY,
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
 * Memoized TextEffectsVerbJump to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbJump = memo(TextEffectsVerbJumpComponent)

