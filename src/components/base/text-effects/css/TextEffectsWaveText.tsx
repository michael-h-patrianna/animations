import { memo } from 'react'
import styles from './TextEffectsWaveText.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsWaveTextProps {
  /** Text content to animate with wave motion. */
  text?: string
  /** Delay between each character's wave cycle in seconds. */
  charDelay?: number
  /** Show animated highlight effect on characters. */
  showHighlight?: boolean
  /** Text color. @default '#3b82f6' */
  color?: string
}

/**
 * Standalone: Copy this file + TextEffectsWaveText.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsWaveTextComponent({
  text = 'WAVE MOTION',
  charDelay = 0.05,
  showHighlight = true,
  color,
}: TextEffectsWaveTextProps) {
  return (
    <div
      className={styles['pf-tfx-wave-text-container']}
      data-animation-id="text-effects__wave-text"
      style={
        color !== undefined
          ? ({ '--text-effects-wave-text-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['pf-tfx-wave-text-wrapper']}>
        {splitGraphemes(text).map((char, index) => {
          const delay = index * charDelay
          const isSpace = char === ' '

          return (
            <span
              key={index}
              className={`${styles['pf-tfx-wave-char']} ${showHighlight && !isSpace ? styles['pf-tfx-wave-char--highlight'] : ''}`}
              style={{
                animationDelay: `${delay}s`,
              }}
            >
              {isSpace ? '\u00A0' : char}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export const TextEffectsWaveText = memo(TextEffectsWaveTextComponent)
