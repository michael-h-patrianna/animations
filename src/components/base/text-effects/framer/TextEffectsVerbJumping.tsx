/**
 * Standalone: Copy this file + TextEffectsVerbJumping.module.css into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbJumping.module.css'

interface TextEffectsVerbJumpingProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Delay between each character's animation start in seconds. @default 0.06 */
  stepDelay?: number
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbJumpingComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.06,
  color,
}: TextEffectsVerbJumpingProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className={styles['pf-verb-jump-fm']}
      data-animation-id="text-effects__verb-jumping"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-jump-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-verb-jump-fm__line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className={styles['pf-verb-jump-fm__char']}
            initial={prefersReducedMotion ? undefined : { y: 0, scaleY: 1 }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -10, 0, -4, 0],
                    scaleY: [1, 0.96, 1.02, 0.98, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
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

export const TextEffectsVerbJumping = memo(TextEffectsVerbJumpingComponent)
