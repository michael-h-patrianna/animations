import { memo } from 'react'
import styles from './TextEffectsCharacterReveal.module.css'

interface TextEffectsCharacterRevealProps {
  /** Main text to reveal. @default 'ACHIEVEMENT' */
  text?: string
  /** Subtitle text below the main reveal. @default 'UNLOCKED' */
  subtitle?: string
  /** Base color for the metallic text gradient. Light/dark stops are computed. @default '#ffd700' */
  color?: string
  /** Subtitle text color. @default derived from color at 80% opacity */
  subtitleColor?: string
}

/**
 * Standalone: Copy this file + TextEffectsCharacterReveal.module.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsCharacterRevealComponent({
  text = 'ACHIEVEMENT',
  subtitle = 'UNLOCKED',
  color,
  subtitleColor,
}: TextEffectsCharacterRevealProps) {
  return (
    <div
      className={styles['pf-tfx-char-reveal-container']}
      data-animation-id="text-effects__character-reveal"
      style={
        {
          ...(color !== undefined ? { '--text-effects-character-reveal-color': color } : {}),
          ...(subtitleColor !== undefined
            ? { '--text-effects-character-reveal-subtitle-color': subtitleColor }
            : {}),
        } as React.CSSProperties
      }
    >
      <div className={styles['pf-tfx-char-reveal-text-container']}>
        {/* Shadow text layer */}
        <div className={styles['pf-tfx-char-reveal-shadow-text']}>
          {text.split('').map((char, index) => (
            <span
              key={`shadow-${index}`}
              className={styles['pf-tfx-char-reveal-shadow-char']}
              style={{ animationDelay: `${300 + index * 30}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Main golden text layer */}
        <div className={styles['pf-tfx-char-reveal-main-text']}>
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={styles['pf-tfx-char-reveal-main-char']}
              style={{ animationDelay: `${600 + index * 50}ms` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className={styles['pf-tfx-char-reveal-subtitle']}>{subtitle}</div>
    </div>
  )
}

export const TextEffectsCharacterReveal = memo(TextEffectsCharacterRevealComponent)
