import * as m from 'motion/react-m'
import { useMemo } from 'react'
import { coinImage } from '@/assets'

/**
 *
 */
export function CollectionEffectsCoinTrail() {
  const coins = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 0.1,
      })),
    []
  )

  return (
    <div
      className="pf-celebration"
      data-animation-id="collection-effects__coin-trail"
    >
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
              left: '10px',
              top: '50px',
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0.5,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              x: [0, 50, 150, 250],
              y: [0, -20, -10, 5],
              scale: [0.5, 0.8, 1, 0.6],
              rotate: [0, 180, 360, 540],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              delay: coin.delay,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.3, 0.7, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
