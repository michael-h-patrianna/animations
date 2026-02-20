import { memo, useMemo } from 'react'
import './TextEffectsVerbTwirl.css'

interface TextEffectsVerbTwirlProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
}

/**
 * Twirling text animation with smooth 360-degree rotation and scale effect.
 * Characters rotate continuously with subtle scale variations for dynamic motion.
 *
 * @example
 * <TextEffectsVerbTwirl />
 * <TextEffectsVerbTwirl text="SPIN AROUND" />
 * <TextEffectsVerbTwirl text="Twirl & Dance" />
 */
function TextEffectsVerbTwirlComponent({ text = 'LOREM IPSUM DOLOR' }: TextEffectsVerbTwirlProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div className="tfx-twirl-container" data-animation-id="text-effects__verb-twirling" aria-label={text}>
      <div className="tfx-twirl-line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tfx-twirl-char"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbTwirl to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbTwirl = memo(TextEffectsVerbTwirlComponent)

export default TextEffectsVerbTwirl

