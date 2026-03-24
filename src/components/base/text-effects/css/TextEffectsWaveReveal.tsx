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
 * Standalone: Copy this file + TextEffectsWaveReveal.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsWaveRevealComponent({
  lines = [
    { text: 'Look at', color: 'var(--pf-anim-blue)' },
    { text: 'these', color: 'var(--pf-anim-green)' },
    { text: 'colors', color: 'var(--pf-anim-gold)' },
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
            <div key={lineIndex} className="tfx-wave-reveal-line" style={{ color: line.color }}>
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
