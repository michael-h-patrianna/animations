/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbTwirlProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbTwirlComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbTwirlProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      data-animation-id="text-effects__verb-twirling"
      aria-label={text}
      style={
        color !== undefined
          ? ({ '--pf-verb-twirl-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              color: color ?? 'var(--pf-verb-twirl-color, #e8e4da)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              transformOrigin: 'center',
            }}
            initial={prefersReducedMotion ? undefined : { rotate: 0, scale: 1 }}
            animate={
              prefersReducedMotion
                ? { scale: [1, 1.04, 1], opacity: [1, 0.85, 1] }
                : {
                    rotate: [0, 90, 180, 270, 360],
                    scale: [1, 1.05, 1, 0.98, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.5, ease: 'easeInOut' }
                : {
                    duration: 1.8,
                    ease: easeInOut,
                    times: [0, 0.25, 0.5, 0.75, 1],
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

export const TextEffectsVerbTwirl = memo(TextEffectsVerbTwirlComponent)
