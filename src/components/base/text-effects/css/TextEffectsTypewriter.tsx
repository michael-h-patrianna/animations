/**
 * Typewriter text reveal with blinking cursor — CSS variant.
 *
 * Copy-paste files: this file + TextEffectsTypewriter.css
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo } from 'react'
import './TextEffectsTypewriter.css'

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
  const charCount = text.length

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
      <div className="pf-typewriter__line">
        <span
          className="pf-typewriter__text"
          style={
            {
              '--pf-chars': charCount,
              animationDuration: `${charCount * charDelay}s`,
              animationTimingFunction: `steps(${charCount}, start)`,
            } as React.CSSProperties
          }
        >
          {text}
        </span>
        <span
          className="pf-typewriter__cursor"
          style={{ animationDelay: `${charCount * charDelay}s` }}
        >
          {cursor}
        </span>
      </div>
    </div>
  )
}

export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)
