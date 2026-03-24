import { memo } from 'react'
import './TextEffectsTypewriter.css'

interface TextEffectsTypewriterProps {
  /** @default 'LOADING SYSTEM...' */
  text?: string
  /** Delay between each character appearance in seconds. @default 0.08 */
  charDelay?: number
  /** Cursor character shown after typing completes. @default '|' */
  cursor?: string
  /** Text and cursor color. @default '#10b981' */
  color?: string
}

/**
 * Standalone: Copy this file + TextEffectsTypewriter.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsTypewriterComponent({
  text = 'LOADING SYSTEM...',
  charDelay = 0.08,
  cursor = '|',
  color,
}: TextEffectsTypewriterProps) {
  return (
    <div
      className="text-effects-typewriter-container"
      data-animation-id="text-effects__typewriter"
      style={color !== undefined ? { '--text-effects-typewriter-color-1': color } as React.CSSProperties : undefined}
    >
      <div className="text-effects-typewriter-text">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="text-effects-typewriter-char"
            style={{ animationDelay: `${index * charDelay}s` }}
          >
            {char}
          </span>
        ))}
        <span
          className="text-effects-typewriter-cursor"
          style={{ animationDelay: `${text.length * charDelay}s` }}
        >
          {cursor}
        </span>
      </div>
    </div>
  )
}

export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)
