import { motion } from 'framer-motion'
import './TextEffectsWaveText.css'

export function TextEffectsWaveText() {
  const text = 'WAVE MOTION'

  return (
    <div className="wave-text-container" data-animation-id="text-effects__wave-text">

      <div className="wave-text-wrapper">
        {text.split('').map((char, index) => {
          const waveDelay = index * 0.05
          const isSpace = char === ' '
          const wavePhase = index % 5

          return (
            <motion.span
              key={index}
              className={`wave-char wave-phase-${wavePhase}`}
              data-char={char}
              initial={{
                y: 0,
                scale: 1,
                rotateZ: 0,
              }}
              animate={{
                // Vertical wave motion
                y: [0, -20, 0, 5, 0],
                // Scale pulsing as wave peaks
                scale: [1, 1.15, 1, 0.95, 1],
                // Subtle rotation for fluidity
                rotateZ: [0, -5, 0, 3, 0],
              }}
              transition={{
                duration: 2,
                delay: waveDelay,
                repeat: Infinity,
                repeatDelay: 1,
                ease: [0.45, 0, 0.55, 1], // Custom wave easing
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            >
              <span className="wave-char-inner">
                {isSpace ? '\u00A0' : char}

                {/* Highlight that travels with the wave */}
                {!isSpace && (
                  <motion.span
                    className="wave-highlight"
                    animate={{
                      opacity: [0, 0.6, 0.3, 0, 0],
                      scaleY: [0.8, 1.2, 1, 0.9, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      delay: waveDelay,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'easeInOut',
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }}
                  />
                )}
              </span>
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}
