import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'

import { pirateChestClosedImage, pirateChestOpenImage, pirateCoinImage } from '@/assets'

import './PrizeRevealPirateChestWin.css'

type RevealPhase = 'rise' | 'shake' | 'reveal'

const DEFAULT_SHAKE_DELAY_MS = 900
const DEFAULT_REVEAL_DELAY_MS = 1500
const DEFAULT_COIN_COUNT = 12
const RAY_COUNT = 18
const RAY_INDICES = Array.from({ length: RAY_COUNT }, (_, index) => index)

type CoinSparkle = {
  id: number
  tx: number
  txEnd: number
  ty: number
  delay: number
  size: number
  rotation: number
  rotationEnd: number
}

function useRevealPhase(shakeDelayMs: number, revealDelayMs: number) {
  const [phase, setPhase] = useState<RevealPhase>('rise')

  useEffect(() => {
    const shakeTimer = window.setTimeout(() => setPhase('shake'), shakeDelayMs)
    const revealTimer = window.setTimeout(() => setPhase('reveal'), revealDelayMs)

    return () => {
      window.clearTimeout(shakeTimer)
      window.clearTimeout(revealTimer)
    }
  }, [revealDelayMs, shakeDelayMs])

  return phase
}

function createCoinSparkles(coinCount: number): CoinSparkle[] {
  return Array.from({ length: coinCount }, (_, index) => {
    const angle = ((index / coinCount) * 130 - 65) * (Math.PI / 180)
    const distance = 82 + Math.random() * 70
    const tx = Math.sin(angle) * distance
    const rotation = 80 + Math.random() * 280

    return {
      id: index,
      tx,
      txEnd: tx * 0.6,
      ty: -Math.cos(angle) * distance - 24,
      delay: index * 0.035,
      size: 16 + Math.random() * 10,
      rotation,
      rotationEnd: rotation * 1.2,
    }
  })
}

function PirateChestWinRays() {
  return (
    <div className="pf-pirate-chest-win-css__rays-wrap">
      <div className="pf-pirate-chest-win-css__rays-enter">
        <div className="pf-pirate-chest-win-css__rays-spin">
          <div className="pf-pirate-chest-win-css__rays">
            {RAY_INDICES.map((index) => (
              <span
                key={index}
                className="pf-pirate-chest-win-css__ray"
                style={{ '--ray-rotation': `${index * (360 / RAY_COUNT)}deg` } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PirateChestWinCoins({ coinSparkles }: { coinSparkles: CoinSparkle[] }) {
  return coinSparkles.map((sparkle) => (
    <img
      key={sparkle.id}
      src={pirateCoinImage}
      alt=""
      aria-hidden="true"
      className="pf-pirate-chest-win-css__coin"
      style={
        {
          '--tx': `${sparkle.tx}px`,
          '--tx-end': `${sparkle.txEnd}px`,
          '--ty': `${sparkle.ty}px`,
          '--delay': `${sparkle.delay}s`,
          '--size': `${sparkle.size}px`,
          '--spin': `${sparkle.rotation}deg`,
          '--spin-end': `${sparkle.rotationEnd}deg`,
        } as CSSProperties
      }
    />
  ))
}

interface PrizeRevealPirateChestWinProps {
  shakeDelayMs?: number
  revealDelayMs?: number
  coinCount?: number
}

function PrizeRevealPirateChestWinComponent({
  shakeDelayMs = DEFAULT_SHAKE_DELAY_MS,
  revealDelayMs = DEFAULT_REVEAL_DELAY_MS,
  coinCount = DEFAULT_COIN_COUNT,
}: PrizeRevealPirateChestWinProps) {
  const phase = useRevealPhase(shakeDelayMs, revealDelayMs)
  const coinSparkles = useMemo(() => createCoinSparkles(coinCount), [coinCount])

  return (
    <div
      className="pf-modal-celebration pf-pirate-chest-win-css"
      data-animation-id="prize-reveal__pirate-chest-win"
    >
      <div className="pf-pirate-chest-win-css__stage">
        <div
          className={`pf-pirate-chest-win-css__chest${phase === 'shake' ? ' is-shaking' : ''}${phase === 'reveal' ? ' is-reveal' : ''}`}
        >
          {phase === 'reveal' && <PirateChestWinRays />}
          <img
            src={phase === 'reveal' ? pirateChestOpenImage : pirateChestClosedImage}
            alt=""
            aria-hidden="true"
            className="pf-pirate-chest-win-css__image"
          />
        </div>

        {phase === 'reveal' && <PirateChestWinCoins coinSparkles={coinSparkles} />}
      </div>
    </div>
  )
}

export const PrizeRevealPirateChestWin = memo(PrizeRevealPirateChestWinComponent)
