import type { AnimationMetadata } from '@/types/animation'
import './MiscSpiralGalaxy.css'

export function MiscSpiralGalaxy() {
  const count = 60
  return (
    <div className="misc-spiral" role="img" aria-label="Spiral galaxy">
      <div className="wheel">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className={`dot i-${i}`} />
        ))}
      </div>
      <span className="dot-center" />
    </div>
  )
}

export const metadata = {
  id: 'misc__spiral-galaxy',
  title: 'Spiral Galaxy',
  description: 'Spiral arrangement of dots slowly rotating with subtle twinkle.',
  tags: ['css']
} satisfies AnimationMetadata
