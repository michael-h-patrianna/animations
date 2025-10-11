import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsTypewriter.css'

export function TextEffectsTypewriter() {
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

export const metadata: AnimationMetadata = {
  id: 'text-effects__typewriter',
  title: 'Typewriter',
  description: 'Classic terminal-style text typing with blinking cursor for system messages.',
  tags: ['css'],
  disableReplay: false
}
