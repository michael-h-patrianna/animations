/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, framer-motion
 * RN parity: Translates cleanly to Moti with MotiText and same animate/transition props.
 * Note: In RN, perspective should be applied inline on the animated element.
 */

import * as m from 'motion/react-m'

import React from 'react'
import { memo } from 'react'

function TextEffectsVerbFlipComponent() {
  const text = 'LOREM IPSUM DOLOR'
  const letters = React.useMemo(() => Array.from(text), [text])

  return (
    <div className="verbFlip" data-animation-id="text-effects__verb-flipping" aria-label={text}>
      <div className="verbFlip__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="verbFlip__char"
            style={{ perspective: 600 }}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: [0, 180, 360]
            }}
            transition={{
              duration: 1.8,
              delay: i % 2 === 1 ? 0.1 : 0, // odd indices get delay
              ease: [0.2, 0.6, 0.2, 1] as const,
              times: [0, 0.3, 1],
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
 * Memoized TextEffectsVerbFlip to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbFlip = memo(TextEffectsVerbFlipComponent)

export default TextEffectsVerbFlip
