import { memo } from 'react'
import styles from './TextEffectsWaveText.module.css'

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
 * Standalone: Copy this file + TextEffectsWaveText.css into your app.
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
      className={styles['tfx-wave-text-container']}
      data-animation-id="text-effects__wave-text"
      style={
        color !== undefined
          ? ({ '--text-effects-wave-text-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <div className={styles['tfx-wave-text-wrapper']}>
        {text.split('').map((char, index) => {
          const delay = index * charDelay
          const isSpace = char === ' '

          return (
            <span
              key={index}
              className={`${styles['tfx-wave-char']} ${showHighlight && !isSpace ? styles['tfx-wave-char--highlight'] : ''}`}
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
