/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbJumpProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Delay between each character's animation start in seconds. @default 0.06 */
  stepDelay?: number
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbJumpComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.06,
  color,
}: TextEffectsVerbJumpProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div data-animation-id="text-effects__verb-jumping" aria-label={text}>
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              color: color ?? 'var(--pf-verb-jump-color, #e8e4da)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              transformOrigin: 'center bottom',
            }}
            initial={prefersReducedMotion ? undefined : { y: 0, scaleY: 1 }}
            animate={
              prefersReducedMotion
                ? { scaleY: [1, 0.97, 1.02, 1] }
                : {
                    y: [0, -10, 0, -4, 0],
                    scaleY: [1, 0.96, 1.02, 0.98, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.5, ease: 'easeInOut' }
                : {
                    duration: 1.6,
                    delay: i * stepDelay,
                    ease: easeInOut,
                    times: [0, 0.2, 0.4, 0.6, 1],
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

export const TextEffectsVerbJump = memo(TextEffectsVerbJumpComponent)
