/**
 * Standalone: Copy this file + TextEffectsVerbJog.css into your app.
 * Runtime deps: react, motion
 * RN: Translates to Moti with MotiText — same animate/transition props.
 */

import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
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
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="pf-verb-jog-fm"
      data-animation-id="text-effects__verb-jogging"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-jog-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className="pf-verb-jog-fm__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="pf-verb-jog-fm__char"
            initial={{ y: 0, rotate: 0 }}
            animate={{
              y: [0, -6, 0, -2, 0],
              rotate: [0, -4, 2, -2, 0],
            }}
            transition={{
              duration: 1.2,
              delay: i % 2 === 0 ? 0.15 : 0,
              ease: easeInOut,
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbJog = memo(TextEffectsVerbJogComponent)
