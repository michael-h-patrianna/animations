import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbJog.module.css'

interface TextEffectsVerbJogProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Jogging text animation with bouncy up-down motion and subtle rotation.
 * Characters bounce with alternating delays creating a rhythmic jogging effect.
 *
 * @example
 * <TextEffectsVerbJog />
 * <TextEffectsVerbJog text="RUN FAST" />
 * <TextEffectsVerbJog text="Quick Brown Fox" />
 */
function TextEffectsVerbJogComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbJogProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className={styles['tfx-jog-container']}
      data-animation-id="text-effects__verb-jogging"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['tfx-jog-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`${styles['tfx-jog-char']} ${i % 2 === 0 ? styles['tfx-jog-char--delayed'] : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbJog = memo(TextEffectsVerbJogComponent)
