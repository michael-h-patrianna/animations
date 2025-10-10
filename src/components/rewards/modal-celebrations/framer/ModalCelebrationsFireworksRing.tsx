import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import './ModalCelebrationsFireworksRing.css'

export function ModalCelebrationsFireworksRing() {
  const shouldReduceMotion = useReducedMotion()

  const rings = useMemo(
    () => [
      { id: 0, scale: 3.2, delay: 0 },
      { id: 1, scale: 2.2, delay: 0.12 },
    ],
    []
  )

  if (shouldReduceMotion) {
    return (
      <div className="pf-celebration">
        <div className="pf-celebration__layer">
          <span className="pf-celebration__ring" style={{ opacity: 0.5, transform: 'translate(-50%, -50%) scale(2)' }} />
        </div>
      </div>
    )
  }

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {rings.map((ring) => (
          <motion.span
            key={ring.id}
            className="pf-celebration__ring"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: ring.scale,
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: 1.6,
              delay: ring.delay,
              times: [0, 0.2, 1],
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'modal-celebrations__fireworks-ring',
  title: 'Fireworks Halo',
  description: 'Celebration effects pattern: Fireworks Halo',
  tags: ['framer'],
} satisfies AnimationMetadata
