import * as m from 'motion/react-m'
import { memo, useEffect, useState } from 'react'

import { pirateChestClosedImage, pirateChestEmptyImage } from '@/assets'

type RevealPhase = 'rise' | 'shake' | 'reveal'

const SHAKE_DELAY_MS = 900
const REVEAL_DELAY_MS = 1500

function PrizeRevealPirateChestNoWinComponent() {
  const [phase, setPhase] = useState<RevealPhase>('rise')

  useEffect(() => {
    const shakeTimer = window.setTimeout(() => setPhase('shake'), SHAKE_DELAY_MS)
    const revealTimer = window.setTimeout(() => setPhase('reveal'), REVEAL_DELAY_MS)

    return () => {
      window.clearTimeout(shakeTimer)
      window.clearTimeout(revealTimer)
    }
  }, [])

  return (
    <div
      className="pf-modal-celebration pf-pirate-chest-no-win"
      data-animation-id="prize-reveal__pirate-chest-no-win"
    >
      <div className="pf-pirate-chest-no-win__stage">
        <m.div
          className="pf-pirate-chest-no-win__chest"
          initial={{ y: 64, opacity: 0, scale: 0.82 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: phase === 'reveal' ? [1, 0.9, 1] : 1,
            x: phase === 'shake' ? [0, -7, 7, -5, 5, 0] : 0,
          }}
          transition={
            phase === 'shake'
              ? { x: { duration: 0.6, ease: 'easeInOut' }, default: { type: 'spring', stiffness: 210, damping: 18 } }
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
            className="pf-pirate-chest-no-win__image"
          />
        </m.div>
      </div>
    </div>
  )
}

export const PrizeRevealPirateChestNoWin = memo(PrizeRevealPirateChestNoWinComponent)
