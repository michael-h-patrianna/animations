import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'
import { coinImage } from '@/assets'

const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsCoinsSwirl() {
  const coins = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const startAngle = randBetween(0, 360)
        const spin = randBetween(240, 360)
        const radius = randBetween(60, 110)
        const delay = i * 0.07
        const duration = 1.2

        // Calculate end position from polar coordinates
        const endAngleRad = ((startAngle + spin) * Math.PI) / 180
        const endX = Math.cos(endAngleRad) * radius
        const endY = Math.sin(endAngleRad) * radius

        // Midpoint at partial spin
        const midAngleRad = ((startAngle + spin * 0.5) * Math.PI) / 180
        const midX = Math.cos(midAngleRad) * radius * 0.6
        const midY = Math.sin(midAngleRad) * radius * 0.6

        return {
          id: i,
          delay,
          duration,
          midX,
          midY,
          endX,
          endY,
          spin,
        }
      }),
    []
  )

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__coins-swirl">
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
              scale: 0.5,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, coin.midX, coin.endX],
              y: [0, coin.midY, coin.endY],
              scale: [0.5, 0.8, 1],
              rotate: [0, coin.spin * 0.5, coin.spin],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              ease: easeOut,
              times: [0, 0.5, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
