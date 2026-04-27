import { memo, useMemo } from 'react'
import styles from './TextEffectsVerbTwirling.module.css'
import { splitGraphemes } from '@/components/base/text-effects/SharedGraphemeSplitter'

interface TextEffectsVerbTwirlingProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Text color. @default '#e8e4da' */
  color?: string
}

/**
 * Twirling text animation with smooth 360-degree rotation and scale effect.
 * Characters rotate continuously with subtle scale variations for dynamic motion.
 *
 * @example
 * <TextEffectsVerbTwirling />
 * <TextEffectsVerbTwirling text="SPIN AROUND" />
 * <TextEffectsVerbTwirling text="Twirl & Dance" />
 */
function TextEffectsVerbTwirlingComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbTwirlingProps) {
  const letters = useMemo(() => splitGraphemes(text), [text])

  return (
    <div
      className={styles['pf-tfx-twirl-container']}
      data-animation-id="text-effects__verb-twirling"
      aria-label={text}
      style={
        color !== undefined ? ({ '--pf-verb-color': color } as React.CSSProperties) : undefined
      }
    >
      <div className={styles['pf-tfx-twirl-line']} aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className={styles['pf-tfx-twirl-char']}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbTwirling = memo(TextEffectsVerbTwirlingComponent)
