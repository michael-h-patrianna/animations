/**
 * Standalone: Copy this file + TextEffectsVerbFloat.module.css into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbFloat.module.css'

interface TextEffectsVerbFloatProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbFloatComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbFloatProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className={styles['pf-verb-float-fm']}
      data-animation-id="text-effects__verb-floating"
      aria-label={text}
      style={
        color !== undefined
          ? ({ '--pf-verb-float-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['pf-verb-float-fm__line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className={styles['pf-verb-float-fm__char']}
            initial={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    y: [0, -6, 0, 4, 0],
                    opacity: [1, 1, 0.95, 1, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 3,
                    delay: i % 2 === 1 ? 0.15 : 0,
                    ease: easeInOut,
                    times: [0, 0.25, 0.5, 0.75, 1],
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

export const TextEffectsVerbFloat = memo(TextEffectsVerbFloatComponent)
