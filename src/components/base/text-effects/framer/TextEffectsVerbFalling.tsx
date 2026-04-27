/**
 * Standalone: Copy this file + TextEffectsVerbFalling.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut, useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbFalling.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbFallingProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Delay between each character's animation start in seconds. @default 0.05 */
  stepDelay?: number
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbFallingComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.05,
  color,
}: TextEffectsVerbFallingProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-verb-fall-fm']}
      data-animation-id="text-effects__verb-falling"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-fall-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-verb-fall-fm__line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className={styles['pf-verb-fall-fm__char']}
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

export const TextEffectsVerbFalling = memo(TextEffectsVerbFallingComponent)
