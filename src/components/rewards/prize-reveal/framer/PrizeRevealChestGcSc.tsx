import * as m from 'motion/react-m'
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  dailyRewardFreeSpinsImage,
  dailyRewardGcImage,
  dailyRewardRandomRewardImage,
  dailyRewardScImage,
  pirateChestClosedImage,
  pirateChestOpenImage,
} from '@/assets'

type RevealPhase = 'rise' | 'shake' | 'reveal'
type SparkleData = { id: number; tx: number; ty: number; size: number; delay: number }
type PrizeConfig = { id: string; label: string | null; src: string; value: number | null; decimals: number; modifier: string }
type PrizePosition = { flyX: number; overshootX: number; delay: number }

const SHAKE_DELAY_MS = 900
const REVEAL_DELAY_MS = 1500
const RAY_COUNT = 14
const RAY_INDICES = Array.from({ length: RAY_COUNT }, (_, i) => i)
const BURST_SPARKLE_COUNT = 18
const DEFAULT_PRIZE_COUNT = 3

const PRIZE_POOL: PrizeConfig[] = [
  { id: 'gc', label: 'GC', src: dailyRewardGcImage, value: 1500, decimals: 0, modifier: 'pf-chest-gc-sc__prize--gc' },
  { id: 'sc', label: 'SC', src: dailyRewardScImage, value: 2.5, decimals: 2, modifier: 'pf-chest-gc-sc__prize--sc' },
  { id: 'fs', label: 'FS', src: dailyRewardFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-chest-gc-sc__prize--fs' },
  { id: 'rr', label: null, src: dailyRewardRandomRewardImage, value: null, decimals: 0, modifier: 'pf-chest-gc-sc__prize--rr' },
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
  return layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT]
}

function useRevealPhase() {
  const [phase, setPhase] = useState<RevealPhase>('rise')
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('shake'), SHAKE_DELAY_MS)
    const t2 = window.setTimeout(() => setPhase('reveal'), REVEAL_DELAY_MS)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [])
  return phase
}

function useCountUp(target: number, durationMs: number, delayMs: number, decimals: number) {
  const [display, setDisplay] = useState(decimals > 0 ? '0.00' : '0')
  const rafRef = useRef(0)
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const start = performance.now()
      const tick = () => {
        const elapsed = performance.now() - start
        const t = Math.min(elapsed / durationMs, 1)
        const eased = 1 - (1 - t) ** 3
        const current = target * eased
        if (t < 1) {
          setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.round(current).toLocaleString())
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setDisplay(decimals > 0 ? target.toFixed(decimals) : target.toLocaleString())
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delayMs)
    return () => { window.clearTimeout(timeout); cancelAnimationFrame(rafRef.current) }
  }, [target, durationMs, delayMs, decimals])
  return display
}

function createBurstSparkles(): SparkleData[] {
  return Array.from({ length: BURST_SPARKLE_COUNT }, (_, i) => {
    const angle = (i / BURST_SPARKLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const distance = 50 + Math.random() * 80
    return { id: i, tx: Math.cos(angle) * distance, ty: Math.sin(angle) * distance - 35, size: 2 + Math.random() * 4, delay: Math.random() * 0.12 }
  })
}

function BurstFlash() {
  return (
    <m.div
      className="pf-chest-gc-sc__burst"
      initial={{ opacity: 0, scale: 0.15, x: '-50%', y: '50%' }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.15, 1, 1.5] }}
      transition={{ duration: 0.65, times: [0, 0.22, 1] as const, ease: 'easeOut' }}
    />
  )
}

function BurstSparkles({ sparkles }: { sparkles: SparkleData[] }) {
  return (
    <div className="pf-chest-gc-sc__sparkles">
      {sparkles.map((s) => (
        <m.div
          key={s.id}
          className="pf-chest-gc-sc__sparkle"
          style={{ '--size': `${s.size}px` } as CSSProperties}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], x: s.tx, y: s.ty, scale: [0, 1.2, 0] }}
          transition={{ duration: 0.5 + Math.random() * 0.25, delay: s.delay, ease: [0.16, 0.84, 0.32, 1] as const }}
        />
      ))}
    </div>
  )
}

function PrizeRays() {
  return (
    <div className="pf-chest-gc-sc__prize-rays-wrap">
      <m.div
        className="pf-chest-gc-sc__prize-rays-spin"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 0.5, delay: 0.4 },
          scale: { duration: 0.5, delay: 0.4, ease: [0.16, 0.84, 0.32, 1] as const },
          rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
        }}
      >
        <m.div
          className="pf-chest-gc-sc__prize-rays"
          animate={{ opacity: [0.45, 0.82, 0.45], scale: [0.96, 1.06, 0.96] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {RAY_INDICES.map((i) => (
            <span key={i} className="pf-chest-gc-sc__prize-ray" style={{ '--ray-rotation': `${i * (360 / RAY_COUNT)}deg` } as CSSProperties} />
          ))}
        </m.div>
      </m.div>
    </div>
  )
}

function PrizeGlow({ delay }: { delay: number }) {
  return (
    <m.div
      className="pf-chest-gc-sc__prize-glow"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.85, 0.6], scale: [0.3, 1.15, 1] }}
      transition={{ duration: 0.55, delay: delay + 0.45, times: [0, 0.55, 1] as const, ease: 'easeOut' }}
    />
  )
}

function PrizeText({ label, amount, delay }: { label: string; amount: string; delay: number }) {
  return (
    <m.div
      className="pf-chest-gc-sc__prize-text"
      initial={{ opacity: 0, y: 10, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: delay + 0.55, ease: [0.16, 0.84, 0.32, 1] as const }}
    >
      <span className="pf-chest-gc-sc__prize-label">{label}</span>
      <span className="pf-chest-gc-sc__prize-amount">{amount}</span>
    </m.div>
  )
}

function Prize({ config, position }: { config: PrizeConfig; position: PrizePosition }) {
  const amount = useCountUp(config.value ?? 0, 600, (position.delay + 0.6) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null
  const xFrames = position.flyX === 0
    ? ['-50%', '-50%', '-50%', '-50%']
    : ['-50%', `calc(-50% + ${position.overshootX}px)`, `calc(-50% + ${position.flyX * 0.95}px)`, `calc(-50% + ${position.flyX}px)`]

  return (
    <m.div
      className={`pf-chest-gc-sc__prize ${config.modifier}`}
      initial={{ x: '-50%', y: 160, scale: 0, opacity: 0 }}
      animate={{ x: xFrames, y: [160, -18, 6, 0], scale: [0, 1.15, 0.94, 1], opacity: [0, 1, 1, 1] }}
      transition={{ duration: 0.88, delay: position.delay, times: [0, 0.48, 0.76, 1] as const, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="pf-chest-gc-sc__prize-icon-wrap">
        <PrizeGlow delay={position.delay} />
        <PrizeRays />
        <img src={config.src} alt="" aria-hidden="true" className="pf-chest-gc-sc__prize-icon" />
      </div>
      {hasText && <PrizeText label={config.label!} amount={amount} delay={position.delay} />}
    </m.div>
  )
}

function Chest({ phase }: { phase: RevealPhase }) {
  return (
    <m.div
      className={`pf-chest-gc-sc__chest${phase === 'shake' ? ' pf-chest-gc-sc__chest--shake' : ''}`}
      initial={{ y: 64, opacity: 0, scale: 0.82 }}
      animate={{ y: 0, opacity: 1, scale: phase === 'reveal' ? [1, 1.24, 0.93, 1] : 1 }}
      transition={
        phase === 'reveal'
          ? { duration: 0.5, times: [0, 0.4, 0.7, 1] as const, ease: [0.68, -0.55, 0.265, 1.55] as const }
          : { type: 'spring', stiffness: 210, damping: 18 }
      }
    >
      <img src={phase === 'reveal' ? pirateChestOpenImage : pirateChestClosedImage} alt="" aria-hidden="true" className="pf-chest-gc-sc__chest-image" />
    </m.div>
  )
}

function ChestAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const sparkles = useMemo(() => createBurstSparkles(), [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const positions = getPrizePositions(prizeCount)

  return (
    <div className="pf-chest-gc-sc__stage">
      <Chest phase={phase} />
      {phase === 'reveal' && (
        <>
          <BurstFlash />
          <BurstSparkles sparkles={sparkles} />
          <div className="pf-chest-gc-sc__prizes">
            {prizes.map((prize, i) => (
              <Prize key={prize.id} config={prize} position={positions[i]} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PrizeRevealChestGcScComponent({ prizeCount = DEFAULT_PRIZE_COUNT }: { prizeCount?: number }) {
  return (
    <div
      className="pf-modal-celebration pf-chest-gc-sc"
      data-animation-id="prize-reveal__chest-gc-sc"
      data-prize-count={prizeCount}
    >
      <ChestAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealChestGcSc = memo(PrizeRevealChestGcScComponent)
