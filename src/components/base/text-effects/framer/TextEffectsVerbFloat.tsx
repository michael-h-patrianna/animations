/**
 * Standalone: Copy this file + TextEffectsVerbFloat.css into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbFloatProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
}

function TextEffectsVerbFloatComponent({
  text = 'LOREM IPSUM DOLOR',
}: TextEffectsVerbFloatProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div className="pf-verb-float" data-animation-id="text-effects__verb-floating" aria-label={text}>
      <div className="pf-verb-float__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="pf-verb-float__char"
            initial={{ y: 0, opacity: 1 }}
            animate={{
              y: [0, -6, 0, 4, 0],
              opacity: [1, 1, 0.95, 1, 1],
            }}
            transition={{
              duration: 3,
              delay: i % 2 === 1 ? 0.15 : 0,
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

export const TextEffectsVerbFloat = memo(TextEffectsVerbFloatComponent)
