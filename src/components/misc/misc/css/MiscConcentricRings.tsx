import type { AnimationMetadata } from '@/types/animation'
import './MiscConcentricRings.css'

export function MiscConcentricRings() {
  return (
    <div className="misc-concentric" role="img" aria-label="Concentric rings">
      {Array.from({ length: 5 }).map((_, r) => {
        const dotCount = 10 + r * 6
        return (
          <div key={r} className={`ring ring-${r}`}>
            {Array.from({ length: dotCount }).map((_, i) => (
              <span key={i} className={`dot i-${i}`} />
            ))}
          </div>
        )
      })}
      <span className="dot-center" />
    </div>
  )
}

export const metadata = {
  id: 'misc__concentric-rings',
  title: 'Concentric Rings',
  description: 'Multiple rings of dots that slowly rotate and breathe.',
  tags: ['css']
} satisfies AnimationMetadata
