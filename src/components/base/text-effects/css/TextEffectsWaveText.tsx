import type { AnimationMetadata } from '@/types/animation'
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

export const metadata: AnimationMetadata = {
  id: 'text-effects__wave-text',
  title: 'Wave Text',
  description: 'Smooth undulating wave motion through characters for fluid text animations.',
  tags: ['css'],
  disableReplay: false
}
