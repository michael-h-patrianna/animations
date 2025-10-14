import { memo } from 'react'
import './TextEffectsTypewriter.css'

function TextEffectsTypewriterComponent() {
  const text = 'LOADING SYSTEM...'
  const cursor = '|'

  return (
    <div className="typewriter-container" data-animation-id="text-effects__typewriter">
      <div className="typewriter-text">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="typewriter-char"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}

        {/* Blinking cursor */}
        <span
          className="typewriter-cursor"
          style={{ animationDelay: `${text.length * 0.08}s` }}
        >
          {cursor}
        </span>
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsTypewriter to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsTypewriter = memo(TextEffectsTypewriterComponent)

