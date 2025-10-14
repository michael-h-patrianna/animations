import { useEffect, useRef, memo } from 'react'
import './TextEffectsCharacterReveal.css'

function TextEffectsCharacterRevealComponent() {
  const text = 'ACHIEVEMENT'
  const subtitle = 'UNLOCKED'

  const shadowTextRef = useRef<HTMLDivElement>(null)
  const mainTextRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const shadowCharsRef = useRef<HTMLSpanElement[]>([])
  const mainCharsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    // Shadow text container fade in
    if (shadowTextRef.current) {
      shadowTextRef.current.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
        ],
        {
          delay: 200,
          duration: 600,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    }

    // Shadow characters - fade in with reduced opacity (blur replaced with opacity)
    shadowCharsRef.current.forEach((char, index) => {
      if (!char) return
      char.animate(
        [
          { opacity: 0 },
          { opacity: 0.5 }, // Reduced opacity instead of blur
        ],
        {
          duration: 300,
          delay: 300 + index * 30,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    })

    // Main text wrapper fade in
    if (mainTextRef.current) {
      mainTextRef.current.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
        ],
        {
          delay: 500,
          duration: 300,
          fill: 'forwards',
        }
      )
    }

    // Main characters animation
    mainCharsRef.current.forEach((char, index) => {
      if (!char) return
      char.animate(
        [
          { opacity: 0, transform: 'translateY(20px) scale(0)' },
          { opacity: 1, transform: 'translateY(0) scale(1.2)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        {
          duration: 400,
          delay: 600 + index * 50,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    })

    // Subtitle animation
    if (subtitleRef.current) {
      subtitleRef.current.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        {
          duration: 500,
          delay: 1200,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    }
  }, [])

  return (
    <div className="character-reveal-container" data-animation-id="text-effects__character-reveal">
      <div className="text-container">
        {/* Dark shadow text that appears first - no blur, just opacity */}
        <div ref={shadowTextRef} className="shadow-text" style={{ opacity: 0 }}>
          {text.split('').map((char, index) => (
            <span
              key={`shadow-${index}`}
              ref={(el) => {
                if (el) shadowCharsRef.current[index] = el
              }}
              className="shadow-char"
              style={{ opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Golden text that animates on top */}
        <div ref={mainTextRef} className="text-wrapper" style={{ opacity: 0 }}>
          {text.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) mainCharsRef.current[index] = el
              }}
              className="text-char"
              style={{ opacity: 0 }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Subtitle text */}
      <div ref={subtitleRef} className="subtitle-text" style={{ opacity: 0 }}>
        {subtitle}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsCharacterReveal to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsCharacterReveal = memo(TextEffectsCharacterRevealComponent)

