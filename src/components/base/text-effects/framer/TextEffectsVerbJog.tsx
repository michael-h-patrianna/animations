/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbJogProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbJogComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbJogProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div data-animation-id="text-effects__verb-jogging" aria-label={text}>
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              color: color ?? 'var(--pf-verb-jog-color, #e8e4da)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              transformOrigin: 'center bottom',
            }}
            initial={prefersReducedMotion ? undefined : { y: 0, rotate: 0 }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -6, 0, -2, 0],
                    rotate: [0, -4, 2, -2, 0],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 1.2,
                    delay: i % 2 === 0 ? 0.15 : 0,
                    ease: easeInOut,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    repeat: Infinity,
                  }
            }
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbJog = memo(TextEffectsVerbJogComponent)
