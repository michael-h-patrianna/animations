import { memo } from 'react'
import './TextEffectsCharacterReveal.css'

/**
 * Pure CSS character reveal effect. Shadow text fades in, then main characters
 * pop in sequentially with scale/translate, followed by subtitle.
 * Dynamic delays set via inline styles.
 */
function TextEffectsCharacterRevealComponent() {
  const text = 'ACHIEVEMENT'
  const subtitle = 'UNLOCKED'

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

      <div className="tfx-char-reveal-subtitle">
        {subtitle}
      </div>
    </div>
  )
}

/** Memoized to prevent re-renders in grid layouts. */
export const TextEffectsCharacterReveal = memo(TextEffectsCharacterRevealComponent)

