
import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'

// Utility function to generate random number between min and max
import { coinImage } from '@/assets'
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsCoinsFountain() {
const coins = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const tx = randBetween(-80, 80)
        const ty = randBetween(-200, -120)
        const delay = i * 0.05
        const duration = 1.1

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
  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {coins.map((coin) => (
          <m.img
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
              translateX: [0, coin.tx, coin.tx * 0.6],
              translateY: [0, coin.ty, -20],
              scale: [0.6, 1, 0.7],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              times: [0, 0.6, 1],
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}

