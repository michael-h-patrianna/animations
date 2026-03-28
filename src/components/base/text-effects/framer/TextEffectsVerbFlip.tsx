/**
 * Standalone: Copy this file into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti — apply perspective inline on the animated element.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsVerbFlipProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbFlipComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbFlipProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div data-animation-id="text-effects__verb-flipping" aria-label={text}>
      <div style={{ display: 'inline-flex', gap: '0.02em' }} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            style={{
              display: 'inline-block',
              color: color ?? 'var(--pf-verb-flip-color, #e8e4da)',
              fontWeight: 700,
              letterSpacing: '0.02em',
              transformOrigin: 'center',
              backfaceVisibility: 'hidden' as const,
              perspective: 600,
            }}
            initial={prefersReducedMotion ? undefined : { rotateY: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: [1, 0, 1], scale: [1, 0.98, 1] }
                : { rotateY: [0, 180, 360] }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.5, ease: 'easeInOut', times: [0, 0.4, 1] }
                : {
                    duration: 1.8,
                    delay: i % 2 === 1 ? 0.1 : 0,
                    ease: [0.2, 0.6, 0.2, 1] as const,
                    times: [0, 0.3, 1],
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

export const TextEffectsVerbFlip = memo(TextEffectsVerbFlipComponent)
