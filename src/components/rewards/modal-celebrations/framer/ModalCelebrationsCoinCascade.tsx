import * as m from 'motion/react-m'
import { useMemo } from 'react'
import { coinImage } from '@/assets'

const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsCoinCascade() {
  const coins = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const startX = Math.random() * 200 + 50
        const driftX1 = (Math.random() - 0.5) * 30
        const driftX2 = (Math.random() - 0.5) * 50
        const driftX3 = (Math.random() - 0.5) * 60
        const delay = i * 0.15 + randBetween(0, 0.1)

        return {
          id: i,
          startX,
          driftX1,
          driftX2,
          driftX3,
          delay,
        }
      }),
    []
  )

  return (
    <div
      className="pf-modal-celebration pf-modal-celebration--coin-cascade"
      data-animation-id="modal-celebrations__coin-cascade"
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {coins.map((coin) => (
          <m.img
            key={coin.id}
            src={coinImage}
            alt="coin"
            style={{
              width: '22px',
              height: '22px',
              position: 'absolute',
              left: `${coin.startX}px`,
              top: '-20px',
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0.3,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, coin.driftX1, coin.driftX2, coin.driftX3],
              y: [0, 40, 80, 140],
              scale: [0.3, 1, 1, 0.5],
              rotate: [0, 180, 360, 540],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.6,
              delay: coin.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
              times: [0, 0.2, 0.6, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
