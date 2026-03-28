/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
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
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      data-animation-id="text-effects__verb-falling"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
        padding: 20,
      }}
      aria-label={text}
    >
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              color: color ?? 'var(--pf-verb-fall-color, #e8e4da)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              transformOrigin: 'center bottom',
            }}
            initial={prefersReducedMotion ? { opacity: 0 } : { y: -12, scaleY: 0.96, opacity: 0.9 }}
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : {
                    y: [-12, 0, 4, 0],
                    scaleY: [0.96, 1.02, 0.98, 1],
                    opacity: [0.9, 1, 1, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.3 }
                : {
                    duration: 1.6,
                    delay: i * stepDelay,
                    ease: easeInOut,
                    times: [0, 0.3, 0.6, 1],
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

export const TextEffectsVerbFall = memo(TextEffectsVerbFallComponent)
