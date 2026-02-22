import * as m from 'motion/react-m'
import { useMemo } from 'react'

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
    <div className="mc-firework" data-animation-id="modal-celebrations__firework">
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
              <m.img
                key={particle.id}
                className="mc-firework__particle"
                src={PARTICLE_IMAGES[particle.imageIndex] ?? PARTICLE_IMAGES[0]}
                alt=""
                initial={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [0, 0, particle.x, particle.x, particle.x],
                  y: [
                    0,
                    0,
                    particle.y,
                    particle.y + FIREWORK_GRAVITY_DISTANCE_PX,
                    particle.y + FIREWORK_GRAVITY_DISTANCE_PX,
                  ],
                  rotate: [0, 0, particle.rotation, particle.rotation + 180, particle.rotation + 180],
                  scale: [0, 0, particle.scale, particle.scale * 0.5, 0],
                  opacity: [0, 1, 1, 0, 0],
                }}
                transition={{
                  duration: FIREWORK_CYCLE_SECONDS,
                  delay: burst.delay + particle.delay,
                  times: [0, 0.08, 0.6, 0.84, 1],
                  ease: ['easeOut', 'easeOut', 'easeIn', 'linear'],
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
