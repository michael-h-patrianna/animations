import { memo, useMemo } from 'react'
import './TextEffectsVerbFloat.css'

interface TextEffectsVerbFloatProps {
  /** The text to animate. Supports any length and whitespace characters.
   * @default "LOREM IPSUM DOLOR"
   */
  text?: string
}

/**
 * Floating text animation with smooth up-and-down wave motion.
 * Each character floats independently with alternating delays for a wave effect.
 *
 * @example
 * <TextEffectsVerbFloat />
 * <TextEffectsVerbFloat text="HELLO WORLD" />
 * <TextEffectsVerbFloat text="A B C" />
 */
function TextEffectsVerbFloatComponent({ text = 'LOREM IPSUM DOLOR' }: TextEffectsVerbFloatProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div className="tfx-float-container" data-animation-id="text-effects__verb-floating" aria-label={text}>
      <div className="tfx-float-line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`tfx-float-char ${i % 2 === 1 ? 'tfx-float-char--delayed' : ''}`}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsVerbFloat to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsVerbFloat = memo(TextEffectsVerbFloatComponent)

export default TextEffectsVerbFloat

