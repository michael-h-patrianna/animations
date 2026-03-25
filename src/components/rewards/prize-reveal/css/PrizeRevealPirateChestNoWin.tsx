import { memo, useEffect, useState } from 'react'

import { pirateChestClosedImage, pirateChestEmptyImage } from '@/assets'

import './PrizeRevealPirateChestNoWin.css'

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
    <div
      className="pf-modal-celebration pf-pirate-chest-no-win-css"
      data-animation-id="prize-reveal__pirate-chest-no-win"
    >
      <div className="pf-pirate-chest-no-win-css__stage">
        <div
          className={`pf-pirate-chest-no-win-css__chest${phase === 'shake' ? ' is-shaking' : ''}${phase === 'reveal' ? ' is-reveal' : ''}`}
        >
          <img
            src={phase === 'reveal' ? pirateChestEmptyImage : pirateChestClosedImage}
            alt=""
            aria-hidden="true"
            className="pf-pirate-chest-no-win-css__image"
          />
        </div>
      </div>
    </div>
  )
}

export const PrizeRevealPirateChestNoWin = memo(PrizeRevealPirateChestNoWinComponent)
