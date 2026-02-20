import { memo, useMemo } from 'react'
import './TextEffectsVerbJog.css'

interface TextEffectsVerbJogProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
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
function TextEffectsVerbJogComponent({ text = 'LOREM IPSUM DOLOR' }: TextEffectsVerbJogProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div className="tfx-jog-container" data-animation-id="text-effects__verb-jogging" aria-label={text}>
      <div className="tfx-jog-line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`tfx-jog-char ${i % 2 === 0 ? 'tfx-jog-char--delayed' : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbJog to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbJog = memo(TextEffectsVerbJogComponent)

export default TextEffectsVerbJog

