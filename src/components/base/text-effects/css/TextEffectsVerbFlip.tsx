import { memo, useMemo } from 'react'
import './TextEffectsVerbFlip.css'

interface TextEffectsVerbFlipProps {
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
 * <TextEffectsVerbFlip />
 * <TextEffectsVerbFlip text="SPIN ME" />
 * <TextEffectsVerbFlip text="Flip That!" />
 */
function TextEffectsVerbFlipComponent({
  text = 'LOREM IPSUM DOLOR',
  color,
}: TextEffectsVerbFlipProps) {
  const letters = useMemo(() => Array.from(text), [text])

  return (
    <div
      className="tfx-flip-container"
      data-animation-id="text-effects__verb-flipping"
      aria-label={text}
      style={
        color !== undefined ? ({ '--lsd-baseColor': color } as React.CSSProperties) : undefined
      }
    >
      <div className="tfx-flip-line" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className={`tfx-flip-char ${i % 2 === 1 ? 'tfx-flip-char--delayed' : ''}`}>
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}

export const TextEffectsVerbFlip = memo(TextEffectsVerbFlipComponent)
