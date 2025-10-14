import { memo } from 'react'
import './TextEffectsWaveText.css'

function TextEffectsWaveTextComponent() {
  const text = 'WAVE MOTION'

  return (
    <div className="wave-text-container" data-animation-id="text-effects__wave-text">
      <div className="wave-text-wrapper">
        {text.split('').map((char, index) => {
          const waveDelay = index * 0.05
          const isSpace = char === ' '
          const wavePhase = index % 5

          return (
            <span
              key={index}
              className={`wave-char wave-phase-${wavePhase}`}
              data-char={char}
              style={{ animationDelay: `${waveDelay}s` }}
            >
              <span className="wave-char-inner">
                {isSpace ? '\u00A0' : char}

                {/* Highlight that travels with the wave */}
                {!isSpace && (
                  <span
                    className="wave-highlight"
                    style={{ animationDelay: `${waveDelay}s` }}
                  />
                )}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Memoized TextEffectsWaveText to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsWaveText = memo(TextEffectsWaveTextComponent)

