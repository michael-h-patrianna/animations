import { memo } from 'react'

import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'

function TextEffectsCharacterRevealComponent() {
  const text = 'ACHIEVEMENT'
  const subtitle = 'UNLOCKED'

  return (
    <div className="character-reveal-container" data-animation-id="text-effects__character-reveal">
      {/* Text container */}
      <div className="text-container">
        {/* Dark shadow text that appears first */}
        <m.div
          className="shadow-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: easeOut,
          }}
        >
          {text.split('').map((char, index) => (
            <m.span
              key={`shadow-${index}`}
              className="shadow-char"
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 0.5,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                delay: 0.3 + index * 0.03,
                ease: easeOut,
              }}
            >
              {char}
            </m.span>
          ))}
        </m.div>

        {/* Golden text that animates on top */}
        <m.div
          className="text-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {text.split('').map((char, index) => (
            <m.span
              key={index}
              className="text-char"
              initial={{
                opacity: 0,
                y: 20,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0, 1.2, 1],
              }}
              transition={{
                duration: 0.4,
                delay: 0.6 + index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            >
              <span className="text-char__main">{char}</span>
              <span aria-hidden="true" className="text-char__glow">
                {char}
              </span>
            </m.span>
          ))}
        </m.div>
      </div>

      {/* Subtitle text */}
      <m.div
        className="subtitle-text"
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: [0, 1],
          y: [10, 0],
        }}
        transition={{
          duration: 0.5,
          delay: 1.2,
          ease: easeOut,
        }}
      >
        <span className="subtitle-text__main">{subtitle}</span>
        <span aria-hidden="true" className="subtitle-text__shadow">
          {subtitle}
        </span>
      </m.div>
    </div>
  )
}

/**
 * Memoized TextEffectsCharacterReveal to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsCharacterReveal = memo(TextEffectsCharacterRevealComponent)

