import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbFlipping.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbFlippingProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Flipping text animation with 3D card-flip effect along the Y-axis.
 * Characters flip 360 degrees with alternating delays for a cascading effect.
 *
 * @example
 * <TextEffectsVerbFlipping />
 * <TextEffectsVerbFlipping text="SPIN ME" />
 * <TextEffectsVerbFlipping text="Flip That!" />
 */
function TextEffectsVerbFlippingComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbFlippingProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-flip-container']}
      data-animation-id="text-effects__verb-flipping"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-flip-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`${styles['pf-tfx-flip-char']} ${i % 2 === 1 ? styles['pf-tfx-flip-char--delayed'] : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbFlipping = memo(TextEffectsVerbFlippingComponent)
