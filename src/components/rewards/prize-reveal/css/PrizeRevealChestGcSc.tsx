/**
 * CSS variant.
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 */
import { memo, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { DemoButton } from '@/components/demo-blocks'
import { useCountUp } from '@/hooks/useCountUp'

import dailyRewardFreeSpinsImage from '@/assets/daily-reward/free-spins.webp'
import dailyRewardGcImage from '@/assets/daily-reward/gc.webp'
import dailyRewardRandomRewardImage from '@/assets/daily-reward/random-reward.webp'
import dailyRewardScImage from '@/assets/daily-reward/sc.webp'
import pirateChestClosedImage from '@/assets/puzzled-pirate/chest-closed.webp'
import pirateChestOpenImage from '@/assets/puzzled-pirate/chest-open.webp'

import styles from './PrizeRevealChestGcSc.module.css'

type RevealPhase = 'rise' | 'shake' | 'reveal'
type SparkleData = { id: number; tx: number; ty: number; size: number; delay: number }
type PrizeConfig = {
  id: string
  label: string | null
  src: string
  value: number | null
  decimals: number
  modifier: string
}
type PrizePosition = { flyX: number; overshootX: number; delay: number }

const SHAKE_DELAY_MS = 900
const REVEAL_DELAY_MS = 1500
const RAY_COUNT = 14
const RAY_INDICES = Array.from({ length: RAY_COUNT }, (_, i) => i)
const BURST_SPARKLE_COUNT = 18
const DEFAULT_PRIZE_COUNT = 3
const CLAIM_APPEAR_DELAY_MS = 800
const CLAIM_FLY_STAGGER = 0.06

const PRIZE_POOL: PrizeConfig[] = [
  {
    id: 'gc',
    label: 'GC',
    src: dailyRewardGcImage,
    value: 1500,
    decimals: 0,
    modifier: styles['pf-chest-gc-sc-css__prize--gc'] ?? '',
  },
  {
    id: 'sc',
    label: 'SC',
    src: dailyRewardScImage,
    value: 2.5,
    decimals: 2,
    modifier: styles['pf-chest-gc-sc-css__prize--sc'] ?? '',
  },
  {
    id: 'fs',
    label: 'FS',
    src: dailyRewardFreeSpinsImage,
    value: 50,
    decimals: 0,
    modifier: styles['pf-chest-gc-sc-css__prize--fs'] ?? '',
  },
  {
    id: 'rr',
    label: null,
    src: dailyRewardRandomRewardImage,
    value: null,
    decimals: 0,
    modifier: styles['pf-chest-gc-sc-css__prize--rr'] ?? '',
  },
]

function getPrizePositions(count: number): PrizePosition[] {
  const layouts: Record<number, PrizePosition[]> = {
    1: [{ flyX: 0, overshootX: 0, delay: 0.02 }],
    2: [
      { flyX: -78, overshootX: -88, delay: 0.02 },
      { flyX: 78, overshootX: 88, delay: 0.1 },
    ],
    3: [
      { flyX: -88, overshootX: -98, delay: 0.02 },
      { flyX: 0, overshootX: 0, delay: 0.08 },
      { flyX: 88, overshootX: 98, delay: 0.14 },
    ],
    4: [
      { flyX: -100, overshootX: -110, delay: 0.02 },
      { flyX: -34, overshootX: -39, delay: 0.07 },
      { flyX: 34, overshootX: 39, delay: 0.12 },
      { flyX: 100, overshootX: 110, delay: 0.17 },
    ],
  }
  return (layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT])!
}

function useRevealPhase() {
  const [phase, setPhase] = useState<RevealPhase>('rise')
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('shake'), SHAKE_DELAY_MS)
    const t2 = window.setTimeout(() => setPhase('reveal'), REVEAL_DELAY_MS)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])
  return phase
}

function createBurstSparkles(): SparkleData[] {
  return Array.from({ length: BURST_SPARKLE_COUNT }, (_, i) => {
    const angle = (i / BURST_SPARKLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const distance = 50 + Math.random() * 80
    return {
      id: i,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 35,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.12,
    }
  })
}

function BurstSparkles({ sparkles }: { sparkles: SparkleData[] }) {
  return (
    <div className={styles['pf-chest-gc-sc-css__sparkles']}>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className={styles['pf-chest-gc-sc-css__sparkle']}
          style={
            {
              '--size': `${s.size}px`,
              '--tx': `${s.tx}px`,
              '--ty': `${s.ty}px`,
              '--sparkle-delay': `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

function PrizeRays() {
  return (
    <div className={styles['pf-chest-gc-sc-css__prize-rays-wrap']}>
      <div className={styles['pf-chest-gc-sc-css__prize-rays-spin']}>
        <div className={styles['pf-chest-gc-sc-css__prize-rays']}>
          {RAY_INDICES.map((i) => (
            <span
              key={i}
              className={styles['pf-chest-gc-sc-css__prize-ray']}
              style={{ '--ray-rotation': `${i * (360 / RAY_COUNT)}deg` } as CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Prize({
  config,
  position,
  claimed,
  claimIndex,
}: {
  config: PrizeConfig
  position: PrizePosition
  claimed: boolean
  claimIndex: number
}) {
  const amount = useCountUp(config.value ?? 0, 600, (position.delay + 0.6) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null

  return (
    <div
      className={`${styles['pf-chest-gc-sc-css__prize']} ${config.modifier}${claimed ? ` ${styles['is-claiming']}` : ''}`}
      style={
        {
          '--fly-x': `${position.flyX}px`,
          '--fly-overshoot': `${position.overshootX}px`,
          '--fly-settle': `${position.flyX * 0.95}px`,
          '--fly-delay': `${position.delay}s`,
          '--glow-delay': `${position.delay + 0.45}s`,
          '--rays-delay': `${position.delay + 0.4}s`,
          '--text-delay': `${position.delay + 0.55}s`,
          '--claim-fly-x': `${position.flyX * 3.5}px`,
          '--claim-delay': `${claimIndex * CLAIM_FLY_STAGGER}s`,
        } as CSSProperties
      }
    >
      <div className={styles['pf-chest-gc-sc-css__prize-icon-wrap']}>
        <div className={styles['pf-chest-gc-sc-css__prize-glow']} />
        <PrizeRays />
        <img
          src={config.src}
          alt=""
          aria-hidden="true"
          className={styles['pf-chest-gc-sc-css__prize-icon']}
        />
      </div>
      {hasText && (
        <div className={styles['pf-chest-gc-sc-css__prize-text']}>
          <span className={styles['pf-chest-gc-sc-css__prize-label']}>{config.label}</span>
          <span className={styles['pf-chest-gc-sc-css__prize-amount']}>{amount}</span>
        </div>
      )}
    </div>
  )
}

function ChestAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const sparkles = useMemo(() => createBurstSparkles(), [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const positions = getPrizePositions(prizeCount)

  const [claimed, setClaimed] = useState(false)
  const [showClaim, setShowClaim] = useState(false)

  useEffect(() => {
    if (phase !== 'reveal') return
    const t = window.setTimeout(() => setShowClaim(true), CLAIM_APPEAR_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  const handleClaim = () => {
    setClaimed(true)
    setShowClaim(false)
  }

  return (
    <div className={styles['pf-chest-gc-sc-css__stage']}>
      <div
        className={`${styles['pf-chest-gc-sc-css__chest']}${phase === 'shake' ? ` ${styles['is-shaking']}` : ''}${phase === 'reveal' ? ` ${styles['is-reveal']}` : ''}`}
      >
        <img
          src={phase === 'reveal' ? pirateChestOpenImage : pirateChestClosedImage}
          alt=""
          aria-hidden="true"
          className={styles['pf-chest-gc-sc-css__chest-image']}
        />
      </div>
      {phase === 'reveal' && (
        <>
          <div className={styles['pf-chest-gc-sc-css__burst']} />
          <BurstSparkles sparkles={sparkles} />
          {claimed && <div className={styles['pf-chest-gc-sc-css__claim-burst']} />}
          <div className={styles['pf-chest-gc-sc-css__prizes']}>
            {prizes.map((prize, i) => (
              <Prize
                key={prize.id}
                config={prize}
                position={positions[i]!}
                claimed={claimed}
                claimIndex={i}
              />
            ))}
          </div>
          {showClaim && !claimed && (
            <DemoButton
              label="Claim"
              className="pf-prize-reveal__action-btn"
              onClick={handleClaim}
            />
          )}
        </>
      )}
    </div>
  )
}

function PrizeRevealChestGcScComponent({
  prizeCount = DEFAULT_PRIZE_COUNT,
}: {
  prizeCount?: number
}) {
  return (
    <div
      className={`pf-modal-celebration ${styles['pf-chest-gc-sc-css']}`}
      data-animation-id="prize-reveal__chest-gc-sc"
      data-prize-count={prizeCount}
    >
      <ChestAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealChestGcSc = memo(PrizeRevealChestGcScComponent)
