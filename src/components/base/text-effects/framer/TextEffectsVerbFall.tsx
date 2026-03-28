/**
 * Standalone: Copy this file + TextEffectsVerbFall.css into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbFallProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Delay between each character's animation start in seconds. @default 0.05 */
  stepDelay?: number
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbFallComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.05,
  color,
}: TextEffectsVerbFallProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="pf-verb-fall-fm"
      data-animation-id="text-effects__verb-falling"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-fall-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className="pf-verb-fall-fm__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="pf-verb-fall-fm__char"
            initial={{ y: -12, scaleY: 0.96, opacity: 0.9 }}
            animate={{
              y: [-12, 0, 4, 0],
              scaleY: [0.96, 1.02, 0.98, 1],
              opacity: [0.9, 1, 1, 1],
            }}
            transition={{
              duration: 1.6,
              delay: i * stepDelay,
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

export const TextEffectsVerbFall = memo(TextEffectsVerbFallComponent)
