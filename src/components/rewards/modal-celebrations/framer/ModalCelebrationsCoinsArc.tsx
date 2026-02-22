
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
export function ModalCelebrationsCoinsArc() {
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
  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-arc">
      <div className="pf-celebration__layer">
        {coins.map((coin) => (
          <m.img
            key={coin.id}
            src={coinImage}
            alt="coin"
            style={{
              width: '24px',
              height: '24px',
              position: 'absolute',
              left: '50%',
              top: '60%',
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0.6,
              opacity: 0,
            }}
            animate={{
              x: coin.tx,
              y: coin.ty,
              scale: 1,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              times: [0, 0.15, 1],
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}

