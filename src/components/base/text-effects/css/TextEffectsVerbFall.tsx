import { memo, useMemo } from 'react'
import './TextEffectsVerbFall.css'

interface TextEffectsVerbFallProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Delay between each character's animation start in seconds.
   * @default 0.05
   */
  stepDelay?: number
}

/**
 * Falling text animation with sequential drop effect and elastic landing.
 * Characters fall into place one after another with bounce and fade-in.
 *
 * @example
 * <TextEffectsVerbFall />
 * <TextEffectsVerbFall text="DROP DOWN" />
 * <TextEffectsVerbFall text="Falling Leaves" stepDelay={0.08} />
 */
function TextEffectsVerbFallComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.05
}: TextEffectsVerbFallProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div className="tev-fall-container" data-animation-id="text-effects__verb-falling" aria-label={text}>
      <div className="tev-fall-line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tev-fall-char"
            style={{ animationDelay: `${i * stepDelay}s` }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbFall to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbFall = memo(TextEffectsVerbFallComponent)

export default TextEffectsVerbFall

