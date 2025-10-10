import type { AnimationMetadata } from '@/types/animation'
import './MiscPendulumWave.css'

export function MiscPendulumWave() {
  return (
    <div className="misc-pendulum" role="img" aria-label="Pendulum wave">
      <div className="bar">
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} className={`pendulum d-${i}`}>
            <span className="bob" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const metadata = {
  id: 'misc__pendulum-wave',
  title: 'Pendulum Wave',
  description: 'Row of pendulums swinging in wave-like motion with phase offsets.',
  tags: ['css']
} satisfies AnimationMetadata
