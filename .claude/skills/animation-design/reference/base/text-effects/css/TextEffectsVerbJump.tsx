import { memo, useMemo } from 'react'
import './TextEffectsVerbJump.css'

interface TextEffectsVerbJumpProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
  /** Delay between each character's animation start in seconds.
   * @default 0.06
   */
  stepDelay?: number
}

/**
 * Jumping text animation with sequential bounce effect and squash-and-stretch.
 * Characters jump one after another with elastic landing for dynamic motion.
 *
 * @example
 * <TextEffectsVerbJump />
 * <TextEffectsVerbJump text="BOUNCE!" />
 * <TextEffectsVerbJump text="Jump High" stepDelay={0.08} />
 */
function TextEffectsVerbJumpComponent({
  text = 'LOREM IPSUM DOLOR',
  stepDelay = 0.06
}: TextEffectsVerbJumpProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div className="tfx-jump-container" data-animation-id="text-effects__verb-jumping" aria-label={text}>
      <div className="tfx-jump-line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="tfx-jump-char"
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
 * Memoized TextEffectsVerbJump to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbJump = memo(TextEffectsVerbJumpComponent)

export default TextEffectsVerbJump

