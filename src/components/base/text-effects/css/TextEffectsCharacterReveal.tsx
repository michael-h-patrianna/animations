import { memo } from 'react'
import './TextEffectsCharacterReveal.css'

interface TextEffectsCharacterRevealProps {
  /** Main text to reveal. @default 'ACHIEVEMENT' */
  text?: string
  /** Subtitle text below the main reveal. @default 'UNLOCKED' */
  subtitle?: string
}

/**
 * Standalone: Copy this file + TextEffectsCharacterReveal.css into your app.
 * Runtime deps: react
 * RN: Not applicable (CSS keyframes). Use framer variant for RN portability.
 */
function TextEffectsCharacterRevealComponent({
  text = 'ACHIEVEMENT',
  subtitle = 'UNLOCKED',
}: TextEffectsCharacterRevealProps) {
  return (
    <div className="tfx-char-reveal-container" data-animation-id="text-effects__character-reveal">
      <div className="tfx-char-reveal-text-container">
        {/* Shadow text layer */}
        <div className="tfx-char-reveal-shadow-text">
          {text.split('').map((char, index) => (
            <span
              key={`shadow-${index}`}
              className="tfx-char-reveal-shadow-char"
              style={{ animationDelay: `${300 + index * 30}ms` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Main golden text layer */}
        <div className="tfx-char-reveal-main-text">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="tfx-char-reveal-main-char"
              style={{ animationDelay: `${600 + index * 50}ms` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="tfx-char-reveal-subtitle">{subtitle}</div>
    </div>
  )
}

export const TextEffectsCharacterReveal = memo(TextEffectsCharacterRevealComponent)
