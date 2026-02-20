import { memo } from 'react'

import * as m from 'motion/react-m'
import { easeOut, type Variants } from 'motion/react'

function TextEffectsWaveRevealComponent() {
  const lines = [
    { text: 'Look at', color: 'var(--pf-anim-blue)' }, // Blue
    { text: 'these', color: 'var(--pf-anim-green)' }, // Green
    { text: 'colors', color: 'var(--pf-anim-gold)' }, // Gold
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Increased to stagger lines more
        delayChildren: 0.2,
      },
    },
  }

  const lineVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        ease: easeOut,
        duration: 0.5,
      },
    },
  }

  return (
    <div className="wave-reveal-container" data-animation-id="text-effects__wave-reveal">
      <m.div
        className="wave-reveal-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lines.map((line, lineIndex) => (
          <m.div
            key={lineIndex}
            className="wave-reveal-line"
            style={{ color: line.color }}
            variants={lineVariants}
          >
            {line.text.split('').map((char, charIndex) => (
              <m.span
                key={`${lineIndex}-${charIndex}`}
                className="wave-reveal-char"
                variants={letterVariants}
              >
                {char === ' ' ? '\u00A0' : char}
              </m.span>
            ))}
          </m.div>
        ))}
      </m.div>
    </div>
  )
}

/**
 * Memoized TextEffectsWaveReveal to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsWaveReveal = memo(TextEffectsWaveRevealComponent)

