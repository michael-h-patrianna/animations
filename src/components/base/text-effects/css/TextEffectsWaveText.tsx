import { memo } from 'react'
import './TextEffectsWaveText.css'

interface TextEffectsWaveTextProps {
  /** Text content to animate with wave motion. */
  text?: string
  /** Delay between each character's wave cycle in seconds. */
  charDelay?: number
  /** Show animated highlight effect on characters. */
  showHighlight?: boolean
}

/**
 * Animates text with a continuous wave motion effect where each character
 * oscillates vertically with scale and rotation, creating a flowing wave.
 *
 * Uses GPU-accelerated transforms (translateY, scale, rotate) for smooth 60fps animation.
 * Creates one DOM span per character for independent wave timing.
 *
 * @param props - Component configuration
 * @param props.text - Text to animate (default: 'WAVE MOTION')
 * @param props.charDelay - Stagger delay between characters (default: 0.05s)
 * @param props.showHighlight - Enable traveling highlight effect (default: true)
 *
 * @returns Animated wave text component
 *
 * @example
 * ```tsx
 * <TextEffectsWaveText
 *   text="HELLO WORLD"
 *   charDelay={0.08}
 *   showHighlight={true}
 * />
 * ```
 *
 * @remarks
 * - Animation loops infinitely with 2s cycle per character
 * - DOM nodes scale linearly with character count
 * - Whitespace preserved with non-breaking spaces
 * - Highlight uses pseudo-element for minimal DOM overhead
 */
function TextEffectsWaveTextComponent({
  text = 'WAVE MOTION',
  charDelay = 0.05,
  showHighlight = true,
}: TextEffectsWaveTextProps) {
  return (
    <div className="tfx-wave-text-container" data-animation-id="text-effects__wave-text">
      <div className="tfx-wave-text-wrapper">
        {text.split('').map((char, index) => {
          const delay = index * charDelay
          const isSpace = char === ' '

          return (
            <span
              key={index}
              className={`tfx-wave-char ${showHighlight && !isSpace ? 'tfx-wave-char--highlight' : ''}`}
              style={{
                animationDelay: `${delay}s`,
              }}
            >
              {isSpace ? '\u00A0' : char}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export const TextEffectsWaveText = memo(TextEffectsWaveTextComponent)

