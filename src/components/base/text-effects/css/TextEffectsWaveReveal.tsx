import { memo } from 'react'
import './TextEffectsWaveReveal.css'

interface TextLine {
  text: string
  color: string
}

interface TextEffectsWaveRevealProps {
  /** Array of text lines with colors. Each line animates sequentially. */
  lines?: TextLine[]
  /** Delay between character reveals in seconds. */
  charDelay?: number
  /** Delay between line animations in seconds. */
  lineDelay?: number
  /** Initial delay before first animation starts in seconds. */
  initialDelay?: number
}

/**
 * Animates multi-line text with a staggered character-by-character reveal effect.
 * Each character translates up from below while fading in, creating a wave reveal.
 *
 * Uses GPU-accelerated transforms (translateY) and opacity for optimal performance.
 * Creates one DOM span per character for independent animation timing.
 *
 * @param props - Component configuration
 * @param props.lines - Text lines with colors to animate
 * @param props.charDelay - Time between each character reveal (default: 0.05s)
 * @param props.lineDelay - Time between each line starting (default: 0.4s)
 * @param props.initialDelay - Time before animation begins (default: 0.2s)
 *
 * @returns Animated text reveal component
 *
 * @example
 * ```tsx
 * <TextEffectsWaveReveal
 *   lines={[
 *     { text: 'Hello', color: '#60a5fa' },
 *     { text: 'World', color: '#FFD700' }
 *   ]}
 *   charDelay={0.03}
 *   lineDelay={0.5}
 * />
 * ```
 *
 * @remarks
 * - DOM nodes scale linearly with character count (whitespace preserved)
 * - Animation delays computed per-character in JS (unavoidable for effect)
 * - CSS handles actual animation via GPU-accelerated keyframes
 */
function TextEffectsWaveRevealComponent({
  lines = [
    { text: 'Look at', color: '#60a5fa' },
    { text: 'these', color: '#c6ff77' },
    { text: 'colors', color: '#FFD700' },
  ],
  charDelay = 0.05,
  lineDelay = 0.4,
  initialDelay = 0.2,
}: TextEffectsWaveRevealProps) {
  return (
    <div className="tfx-wave-reveal-container" data-animation-id="text-effects__wave-reveal">
      <div className="tfx-wave-reveal-wrapper">
        {lines.map((line, lineIndex) => {
          const lineStart = initialDelay + lineIndex * lineDelay
          return (
            <div
              key={lineIndex}
              className="tfx-wave-reveal-line"
              style={{ color: line.color }}
            >
              {line.text.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className="tfx-wave-reveal-char"
                  style={{
                    animationDelay: `${lineStart + charIndex * charDelay}s`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const TextEffectsWaveReveal = memo(TextEffectsWaveRevealComponent)

