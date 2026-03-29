import { MotionConfig } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useEffect, useState } from 'react'

import styles from './PrizeRevealPirateChestNoWin.module.css'
import pirateChestClosedImage from '@/assets/puzzled-pirate/chest-closed.webp'
import pirateChestEmptyImage from '@/assets/puzzled-pirate/chest-empty.webp'

type RevealPhase = 'rise' | 'shake' | 'reveal'

const DEFAULT_SHAKE_DELAY_MS = 900
const DEFAULT_REVEAL_DELAY_MS = 1500

interface PrizeRevealPirateChestNoWinProps {
  shakeDelayMs?: number
  revealDelayMs?: number
}

function PrizeRevealPirateChestNoWinComponent({
  shakeDelayMs = DEFAULT_SHAKE_DELAY_MS,
  revealDelayMs = DEFAULT_REVEAL_DELAY_MS,
}: PrizeRevealPirateChestNoWinProps) {
  const [phase, setPhase] = useState<RevealPhase>('rise')

  useEffect(() => {
    const shakeTimer = window.setTimeout(() => setPhase('shake'), shakeDelayMs)
    const revealTimer = window.setTimeout(() => setPhase('reveal'), revealDelayMs)

    return () => {
      window.clearTimeout(shakeTimer)
      window.clearTimeout(revealTimer)
    }
  }, [revealDelayMs, shakeDelayMs])

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`pf-modal-celebration ${styles['pf-pirate-chest-no-win-fm']}`}
        data-animation-id="prize-reveal__pirate-chest-no-win"
      >
        <div className={styles['pf-pirate-chest-no-win-fm__stage']}>
          <m.div
            className={styles['pf-pirate-chest-no-win-fm__chest']}
            initial={{ y: 64, opacity: 0, scale: 0.82 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: phase === 'reveal' ? [1, 0.9, 1] : 1,
              x: phase === 'shake' ? [0, -7, 7, -5, 5, 0] : 0,
            }}
            transition={
              phase === 'shake'
                ? {
                    x: { duration: 0.6, ease: 'easeInOut' },
                    default: { type: 'spring', stiffness: 210, damping: 18 },
                  }
                : phase === 'reveal'
                  ? {
                      duration: 0.4,
                      times: [0, 0.5, 1] as const,
                      ease: [0.22, 0.61, 0.36, 1] as const,
                    }
                  : { type: 'spring', stiffness: 210, damping: 18 }
            }
          >
            <img
              src={phase === 'reveal' ? pirateChestEmptyImage : pirateChestClosedImage}
              alt=""
              aria-hidden="true"
              className={styles['pf-pirate-chest-no-win-fm__image']}
            />
          </m.div>
        </div>
      </div>
    </MotionConfig>
  )
}

export const PrizeRevealPirateChestNoWin = memo(PrizeRevealPirateChestNoWinComponent)
