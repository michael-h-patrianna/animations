import { memo } from 'react'
import styles from './TextEffectsWaveReveal.module.css'

interface TextEffectsWaveRevealProps {
  /** Text for the first line. @default 'Look at' */
  line1Text?: string
  /** Color for the first line (also tints its glow). @default 'var(--pf-anim-blue)' */
  line1Color?: string
  /** Text for the second line. @default 'these' */
  line2Text?: string
  /** Color for the second line (also tints its glow). @default 'var(--pf-anim-green)' */
  line2Color?: string
  /** Text for the third line. @default 'colors' */
  line3Text?: string
  /** Color for the third line (also tints its glow). @default 'var(--pf-anim-gold)' */
  line3Color?: string
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
  line1Text = 'Look at',
  line1Color = 'var(--pf-anim-blue)',
  line2Text = 'these',
  line2Color = 'var(--pf-anim-green)',
  line3Text = 'colors',
  line3Color = 'var(--pf-anim-gold)',
  charDelay = 0.05,
  lineDelay = 0.4,
  initialDelay = 0.2,
}: TextEffectsWaveRevealProps) {
  const lines = [
    { text: line1Text, color: line1Color },
    { text: line2Text, color: line2Color },
    { text: line3Text, color: line3Color },
  ]
  return (
    <div
      className={styles['tfx-wave-reveal-container']}
      data-animation-id="text-effects__wave-reveal"
    >
      <div className={styles['tfx-wave-reveal-wrapper']}>
        {lines.map((line, lineIndex) => {
          const lineStart = initialDelay + lineIndex * lineDelay
          return (
            <div
              key={lineIndex}
              className={styles['tfx-wave-reveal-line']}
              style={{ color: line.color, '--line-index': lineIndex } as React.CSSProperties}
            >
              {line.text.split('').map((char, charIndex) => (
                <span
                  key={charIndex}
                  className={styles['tfx-wave-reveal-char']}
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
