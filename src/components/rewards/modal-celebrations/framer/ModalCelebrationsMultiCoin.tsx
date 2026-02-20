import * as m from 'motion/react-m'
import { useMemo } from 'react'
import { coinImage } from '@/assets'

/**
 *
 */
export function ModalCelebrationsMultiCoin() {
  const groups = useMemo(() => {
    const groupCount = 3
    const coinsPerGroup = 5

    return Array.from({ length: groupCount }, (_, g) => {
      const groupX = 60 + g * 80
      const groupDelay = g * 0.3

      const coins = Array.from({ length: coinsPerGroup }, (_, i) => {
        const angle = (i / coinsPerGroup) * 2 * Math.PI
        const radius = 40
        const endX = Math.cos(angle) * radius
        const endY = Math.sin(angle) * radius
        const coinDelay = groupDelay + i * 0.08

        return {
          id: g * coinsPerGroup + i,
          endX,
          endY,
          delay: coinDelay,
        }
      })

      return { id: g, groupX, coins }
    })
  }, [])

  return (
    <div
      className="pf-modal-celebration pf-modal-celebration--multi-coin"
      data-animation-id="modal-celebrations__multi-coin"
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              position: 'absolute',
              left: `${group.groupX}px`,
              top: '30px',
            }}
          >
            {group.coins.map((coin) => (
              <m.img
                key={coin.id}
                src={coinImage}
                alt="coin"
                style={{
                  width: '20px',
                  height: '20px',
                  position: 'absolute',
                  left: '20px',
                  top: '20px',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0.2,
                  rotate: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [0, coin.endX * 0.3, coin.endX, coin.endX * 1.2],
                  y: [0, coin.endY * 0.3, coin.endY, coin.endY * 1.2],
                  scale: [0.2, 1.2, 1, 0.4],
                  rotate: [0, 180, 360, 540],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.6,
                  delay: coin.delay,
                  ease: [0.175, 0.885, 0.32, 1.275],
                  times: [0, 0.3, 0.7, 1],
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
