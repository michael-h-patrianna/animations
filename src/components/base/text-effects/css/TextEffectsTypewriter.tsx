/**
 * Typewriter text reveal with blinking cursor — CSS variant.
 *
 * Copy-paste files: this file + TextEffectsTypewriter.module.css
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */

import { memo, useMemo } from 'react'
import styles from './TextEffectsTypewriter.module.css'

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
  const chars = useMemo(() => text.split(''), [text])

  return (
    <div
      className={styles['tfx-typewriter']}
      data-animation-id="text-effects__typewriter"
      style={
        color !== undefined
          ? ({ '--tfx-typewriter-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['tfx-typewriter__text']}>
        {chars.map((char, index) => (
          <span
            key={index}
            className={styles['tfx-typewriter__char']}
            style={{ animationDelay: `${index * charDelay}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}

        <span
          className={styles['tfx-typewriter__cursor']}
          style={{ animationDelay: `${chars.length * charDelay}s` }}
        >
          {cursor}
        </span>
      </div>
    </div>
  )
}

export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)
