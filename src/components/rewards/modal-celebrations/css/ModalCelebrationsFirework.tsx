import { useMemo, type CSSProperties } from 'react'
import './ModalCelebrationsFirework.css'

import {
  modalCelebrationsFireworkParticle1Image,
  modalCelebrationsFireworkParticle2Image,
  modalCelebrationsFireworkParticle3Image,
} from '@/assets'
import {
  FIREWORK_CYCLE_SECONDS,
  FIREWORK_DURATION_SECONDS,
  FIREWORK_GRAVITY_DISTANCE_PX,
  generateFireworkBursts,
} from '../fireworkModel'

const PARTICLE_IMAGES = [
  modalCelebrationsFireworkParticle1Image,
  modalCelebrationsFireworkParticle2Image,
  modalCelebrationsFireworkParticle3Image,
] as const

/** Endless firework overlay using Lucky Bunny particle images. */
export function ModalCelebrationsFirework() {
  const bursts = useMemo(() => generateFireworkBursts(PARTICLE_IMAGES.length), [])

  return (
    <div className="mc-firework mc-firework--css" data-animation-id="modal-celebrations__firework">
      <div className="mc-firework__wave">
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="mc-firework__burst"
            style={{
              left: `${burst.posX}%`,
              top: `${burst.posY}%`,
            }}
          >
            {burst.imageParticles.map((particle) => (
              <span
                key={particle.id}
                className="mc-firework__particle"
                style={
                  {
                    '--fw-x': `${particle.x}px`,
                    '--fw-y': `${particle.y}px`,
                    '--fw-rotation': `${particle.rotation}deg`,
                    '--fw-scale': String(particle.scale),
                    '--fw-duration': `${FIREWORK_DURATION_SECONDS}s`,
                    '--fw-cycle-duration': `${FIREWORK_CYCLE_SECONDS}s`,
                    '--fw-gravity-distance': `${FIREWORK_GRAVITY_DISTANCE_PX}px`,
                    '--fw-delay': `${burst.delay + particle.delay}s`,
                  } as CSSProperties
                }
              >
                <img
                  className="mc-firework__particle-image"
                  src={PARTICLE_IMAGES[particle.imageIndex] ?? PARTICLE_IMAGES[0]}
                  alt=""
                />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
