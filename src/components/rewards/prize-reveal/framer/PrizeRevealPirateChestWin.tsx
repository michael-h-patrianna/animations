import * as m from 'motion/react-m'
import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'

import {
  pirateChestClosedImage,
  pirateChestOpenImage,
  pirateCoinImage,
} from '@/assets'

type RevealPhase = 'rise' | 'shake' | 'reveal'

const SHAKE_DELAY_MS = 900
const REVEAL_DELAY_MS = 1500
const COIN_COUNT = 12
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

function useRevealPhase() {
  const [phase, setPhase] = useState<RevealPhase>('rise')

  useEffect(() => {
    const shakeTimer = window.setTimeout(() => setPhase('shake'), SHAKE_DELAY_MS)
    const revealTimer = window.setTimeout(() => setPhase('reveal'), REVEAL_DELAY_MS)

    return () => {
      window.clearTimeout(shakeTimer)
      window.clearTimeout(revealTimer)
    }
  }, [])

  return phase
}

function createCoinSparkles(): CoinSparkle[] {
  return Array.from({ length: COIN_COUNT }, (_, index) => {
    const angle = ((index / COIN_COUNT) * 130 - 65) * (Math.PI / 180)
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

function PirateChestWinCoins({ coinSparkles }: { coinSparkles: CoinSparkle[] }) {
  return coinSparkles.map((sparkle) => (
    <m.img
      key={sparkle.id}
      src={pirateCoinImage}
      alt=""
      aria-hidden="true"
      className="pf-pirate-chest-win__coin"
      style={{
        width: sparkle.size,
        height: sparkle.size,
      }}
      initial={{ x: '-50%', y: 0, scale: 0.55, rotate: 0, opacity: 0 }}
      animate={{
        x: ['-50%', `calc(-50% + ${sparkle.tx}px)`, `calc(-50% + ${sparkle.txEnd}px)`],
        y: [0, sparkle.ty, -24],
        scale: [0.55, 1, 0.75],
        rotate: [0, sparkle.rotation, sparkle.rotationEnd],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 0.9,
        delay: sparkle.delay,
        times: [0, 0.22, 0.72, 1] as const,
        ease: [0, 0, 0.2, 1] as const,
      }}
    />
  ))
}

function PirateChestWinRays() {
  return (
    <div className="pf-pirate-chest-win__rays-wrap">
      <m.div
        className="pf-pirate-chest-win__rays-enter"
        initial={{ opacity: 0, scale: 0.82 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.45,
          ease: [0.16, 0.84, 0.32, 1] as const,
        }}
      >
        <m.div
          className="pf-pirate-chest-win__rays-spin"
          animate={{ rotate: 360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <m.div
            className="pf-pirate-chest-win__rays"
            animate={{ opacity: [0.52, 0.72, 0.52], scale: [0.97, 1.03, 0.97] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {RAY_INDICES.map((index) => (
              <span
                key={index}
                className="pf-pirate-chest-win__ray"
                style={{ '--ray-rotation': `${index * (360 / RAY_COUNT)}deg` } as CSSProperties}
              />
            ))}
          </m.div>
        </m.div>
      </m.div>
    </div>
  )
}

function PrizeRevealPirateChestWinComponent() {
  const phase = useRevealPhase()
  const coinSparkles = useMemo(
    () => createCoinSparkles(),
    []
  )

  return (
    <div
      className="pf-modal-celebration pf-pirate-chest-win"
      data-animation-id="prize-reveal__pirate-chest-win"
    >
      <div className="pf-pirate-chest-win__stage">
        <m.div
          className={`pf-pirate-chest-win__chest${phase === 'shake' ? ' pf-pirate-chest-win__chest--shake' : ''}`}
          initial={{ y: 64, opacity: 0, scale: 0.82 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: phase === 'reveal' ? [1, 1.18, 1] : 1,
          }}
          transition={
            phase === 'reveal'
              ? {
                  duration: 0.42,
                  times: [0, 0.58, 1] as const,
                  ease: [0.68, -0.55, 0.265, 1.55] as const,
                }
              : { type: 'spring', stiffness: 210, damping: 18 }
          }
        >
          {phase === 'reveal' && <PirateChestWinRays />}
          <img
            src={phase === 'reveal' ? pirateChestOpenImage : pirateChestClosedImage}
            alt=""
            aria-hidden="true"
            className="pf-pirate-chest-win__image"
          />
        </m.div>

        {phase === 'reveal' && <PirateChestWinCoins coinSparkles={coinSparkles} />}
      </div>
    </div>
  )
}

export const PrizeRevealPirateChestWin = memo(PrizeRevealPirateChestWinComponent)
