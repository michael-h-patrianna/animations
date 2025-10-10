import type { AnimationMetadata } from '@/types/animation'
import coinImage from '@/assets/coin.png'
import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import './ModalCelebrationsCoinsArc.css'

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export function ModalCelebrationsCoinsArc() {
  const shouldReduceMotion = useReducedMotion()

  const coins = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const tx = randBetween(-120, 120)
        const ty = randBetween(-160, -60)
        const delay = i * 0.04
        const duration = 0.9

        return {
          id: i,
          tx,
          ty,
          delay,
          duration,
        }
      }),
    []
  )

  if (shouldReduceMotion) {
    return (
      <div className="pf-celebration">
        <div className="pf-celebration__layer">
          {coins.slice(0, 3).map((coin) => (
            <img
              key={coin.id}
              src={coinImage}
              alt="coin"
              className="pf-celebration__coin"
              style={{
                width: '24px',
                height: '24px',
                position: 'absolute',
                left: '50%',
                top: '60%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.8,
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
        {coins.map((coin) => (
          <motion.img
            key={coin.id}
            src={coinImage}
            alt="coin"
            className="pf-celebration__coin"
            style={{
              width: '24px',
              height: '24px',
              position: 'absolute',
              left: '50%',
              top: '60%',
            }}
            initial={{
              x: '-50%',
              y: '-50%',
              translateX: 0,
              translateY: 0,
              scale: 0.6,
              opacity: 0,
            }}
            animate={{
              translateX: coin.tx,
              translateY: coin.ty,
              scale: 1,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              times: [0, 0.15, 1],
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  id: 'modal-celebrations__coins-arc',
  title: 'Coin Arc Fountain',
  description: 'Celebration effects pattern: Coin Arc Fountain',
  tags: ['framer'],
} satisfies AnimationMetadata
