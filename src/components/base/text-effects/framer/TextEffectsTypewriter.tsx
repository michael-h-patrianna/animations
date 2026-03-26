/**
 * Standalone: Copy this file + TextEffectsTypewriter.css into your app.
 * Runtime deps: react, motion
 * RN: Port cursor blink with Moti useAnimatedStyle infinite loop.
 */

import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { memo, useMemo } from 'react'

interface TextEffectsTypewriterProps {
  /** @default 'LOADING SYSTEM...' */
  text?: string
  /** Delay between each character appearance in seconds. @default 0.08 */
  charDelay?: number
  /** Cursor character shown after typing completes. @default '|' */
  cursor?: string
  /** Text and cursor color. @default '#10b981' */
  color?: string
}

function TextEffectsTypewriterComponent({
  text = 'LOADING SYSTEM...',
  charDelay = 0.08,
  cursor = '|',
  color,
}: TextEffectsTypewriterProps) {
  const prefersReducedMotion = useReducedMotion()
  const chars = useMemo(() => text.split(''), [text])

  return (
    <div
      className="pf-typewriter"
      data-animation-id="text-effects__typewriter"
      style={
        color !== undefined
          ? ({ '--pf-typewriter-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className="pf-typewriter__text">
        {chars.map((char, index) => (
          <m.span
            key={index}
            className="pf-typewriter__char"
            initial={prefersReducedMotion ? { opacity: 1, display: 'inline-block' } : { opacity: 0, display: 'none' }}
            animate={{ opacity: 1, display: 'inline-block' }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0, delay: index * charDelay }}
          >
            {char === ' ' ? '\u00A0' : char}
          </m.span>
        ))}

        <m.span
          className="pf-typewriter__cursor"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            times: [0, 0.5, 0.5, 1],
            ease: 'linear' as const,
            delay: prefersReducedMotion ? 0 : chars.length * charDelay,
          }}
        >
          {cursor}
        </m.span>
      </div>
    </div>
  )
}

export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)
