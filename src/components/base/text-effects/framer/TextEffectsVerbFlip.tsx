/**
 * Standalone: Copy this file + TextEffectsVerbFlip.css into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti — apply perspective inline on the animated element.
 */

import * as m from 'motion/react-m'
import { memo, useMemo } from 'react'

interface TextEffectsVerbFlipProps {
  /** @default 'LOREM IPSUM DOLOR' */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

function TextEffectsVerbFlipComponent({ text = 'LOREM IPSUM DOLOR', color }: TextEffectsVerbFlipProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="pf-verb-flip"
      data-animation-id="text-effects__verb-flipping"
      aria-label={text}
      style={color !== undefined ? { '--pf-verb-flip-color': color } as React.CSSProperties : undefined}
    >
      <div className="pf-verb-flip__line" aria-hidden="true">
        {letters.map((ch, i) => (
          <m.span
            key={i}
            className="pf-verb-flip__char"
            style={{ perspective: 600 }}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: [0, 180, 360],
            }}
            transition={{
              duration: 1.8,
              delay: i % 2 === 1 ? 0.1 : 0,
              ease: [0.2, 0.6, 0.2, 1] as const,
              times: [0, 0.3, 1],
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </m.span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbFlip = memo(TextEffectsVerbFlipComponent)
