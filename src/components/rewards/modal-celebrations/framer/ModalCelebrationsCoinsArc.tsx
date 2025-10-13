import coinImage from '@/assets/coin.png'
import '../shared.css'

import { easeOut, motion } from 'framer-motion'
import { useMemo } from 'react'
import './ModalCelebrationsCoinsArc.css'

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

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
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}


