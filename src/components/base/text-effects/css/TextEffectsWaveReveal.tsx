import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsWaveReveal.css'

export function TextEffectsWaveReveal() {
  const lines = [
    { text: 'Look at', color: '#60a5fa' }, // Blue
    { text: 'these', color: '#c6ff77' }, // Green
    { text: 'colors', color: '#FFD700' }, // Gold
  ]

  return (
    <div className="wave-reveal-container" data-animation-id="text-effects__wave-reveal">
      <div className="wave-reveal-wrapper">
        {lines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className="wave-reveal-line"
            style={{
              color: line.color,
              animationDelay: `${0.2 + lineIndex * 0.4}s`
            }}
          >
            {line.text.split('').map((char, charIndex) => (
              <span
                key={`${lineIndex}-${charIndex}`}
                className="wave-reveal-char"
                style={{
                  animationDelay: `${0.2 + lineIndex * 0.4 + charIndex * 0.05}s`
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__wave-reveal',
  title: 'Wave Reveal',
  description: 'Staggered wave animation where text appears from bottom with smooth easing.',
  tags: ['css'],
  disableReplay: false
}
