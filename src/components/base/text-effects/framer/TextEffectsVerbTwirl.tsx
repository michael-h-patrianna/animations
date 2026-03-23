/**
 * Standalone: Copy this file + TextEffectsVerbTwirl.css into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbTwirlProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
}

function TextEffectsVerbTwirlComponent({ text = 'LOREM IPSUM DOLOR' }: TextEffectsVerbTwirlProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="pf-verb-twirl"
      data-animation-id="text-effects__verb-twirling"
      aria-label={text}
    >
      <div className="pf-verb-twirl__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="pf-verb-twirl__char"
            initial={{ rotate: 0, scale: 1 }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 1, 0.98, 1],
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

export const TextEffectsVerbTwirl = memo(TextEffectsVerbTwirlComponent)
