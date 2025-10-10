import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import './ModalCelebrationsFireworksTriple.css'

const fireworkColors = ['#ffce1a', '#ff5981', '#47fff4', '#c6ff77']

export function ModalCelebrationsFireworksTriple() {
  const shouldReduceMotion = useReducedMotion()

  const fireworks = useMemo(
    () =>
      fireworkColors.map((color, index) => ({
        id: index,
        color,
        size: `${18 + index * 8}px`,
        scale: 1.6 + index * 0.4,
        delay: index * 0.16,
      })),
    []
  )

  if (shouldReduceMotion) {
    return (
      <div className="pf-celebration">
        <div className="pf-celebration__layer">
          {fireworks.slice(0, 2).map((firework) => (
            <span
              key={firework.id}
              className="pf-celebration__firework"
              style={{
                borderColor: firework.color,
                opacity: 0.5,
                transform: 'translate(-50%, -50%) scale(1.5)',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {fireworks.map((firework) => (
          <motion.span
            key={firework.id}
            className="pf-celebration__firework"
            style={{ borderColor: firework.color }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: firework.scale,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.6,
              delay: firework.delay,
              times: [0, 0.3, 1],
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
  id: 'modal-celebrations__fireworks-triple',
  title: 'Fireworks Triple Burst',
  description: 'Celebration effects pattern: Fireworks Triple Burst',
  tags: ['framer'],
} satisfies AnimationMetadata
