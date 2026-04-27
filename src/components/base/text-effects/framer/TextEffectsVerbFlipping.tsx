/**
 * Standalone: Copy this file + TextEffectsVerbFlipping.module.css + SharedGraphemeSplitter.ts into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti — apply perspective inline on the animated element.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbFlipping.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbFlippingProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbFlippingComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbFlippingProps) {
  const prefersReducedMotion = useReducedMotion()
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-verb-flip-fm']}
      data-animation-id="text-effects__verb-flipping"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-flip-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-verb-flip-fm__line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className={styles['pf-verb-flip-fm__char']}
            style={{ perspective: 600 }}
            initial={prefersReducedMotion ? { opacity: 0 } : { rotateY: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { rotateY: [0, 180, 360] }}
            transition={
              prefersReducedMotion
                ? { duration: 0.3, delay: i * 0.02 }
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

export const TextEffectsVerbFlipping = memo(TextEffectsVerbFlippingComponent)
