import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  arcanePortalFreeSpinsImage,
  arcanePortalGcImage,
  arcanePortalRandomRewardImage,
  arcanePortalScImage,
  crystalShatterBodyImage,
  crystalShatterDustImage,
  crystalShatterFrameImage,
} from '@/assets'

import {
  AmbientDust,
  ClaimBurst,
  ClaimButton,
  CrystalFragments,
  DustSpray,
  EnergyMotes,
  LandingRing,
  PrismaticRingBurst,
  SHARD_IMAGES,
  ShatterFlash,
  type DustData,
  type FragmentData,
  type MoteData,
  type OrbitDustData,
  type ShatterPhase,
} from '../CrystalShatterParts'

/* ─── Types ─── */

type PrizeConfig = { id: string; label: string | null; src: string; value: number | null; decimals: number; modifier: string }
type PrizeSlot = { x: number; y: number; delay: number }

/* ─── Constants ─── */

const CHARGE_START_MS = 1200
const SHATTER_START_MS = 2400
const REVEAL_START_MS = 3200
const IDLE_START_MS = 5200
const CLAIM_APPEAR_DELAY_MS = 800
const CLAIM_FLY_STAGGER = 0.08
const FRAGMENT_COUNT = 9
const CONVERGE_MOTE_COUNT = 14
const DUST_SPRAY_COUNT = 24
const ORBIT_DUST_PER_PRIZE = 3
const DEFAULT_PRIZE_COUNT = 3

const PRIZE_POOL: PrizeConfig[] = [
  { id: 'gc', label: 'GC', src: arcanePortalGcImage, value: 1500, decimals: 0, modifier: 'pf-crystal-shatter__prize--gc' },
  { id: 'sc', label: 'SC', src: arcanePortalScImage, value: 2.5, decimals: 2, modifier: 'pf-crystal-shatter__prize--sc' },
  { id: 'fs', label: 'FS', src: arcanePortalFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-crystal-shatter__prize--fs' },
  { id: 'rr', label: null, src: arcanePortalRandomRewardImage, value: null, decimals: 0, modifier: 'pf-crystal-shatter__prize--rr' },
]

function getPrizeSlots(count: number): PrizeSlot[] {
  const layouts: Record<number, PrizeSlot[]> = {
    1: [{ x: 0, y: -10, delay: 0 }],
    2: [
      { x: -80, y: -10, delay: 0 },
      { x: 80, y: -10, delay: 0.15 },
    ],
    3: [
      { x: -120, y: -10, delay: 0 },
      { x: 0, y: -10, delay: 0.15 },
      { x: 120, y: -10, delay: 0.3 },
    ],
    4: [
      { x: -140, y: -10, delay: 0 },
      { x: -47, y: -10, delay: 0.15 },
      { x: 47, y: -10, delay: 0.3 },
      { x: 140, y: -10, delay: 0.45 },
    ],
  }
  return layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT]
}

/* ─── Hooks ─── */

function useRevealPhase() {
  const [phase, setPhase] = useState<ShatterPhase>('descent')
  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase('charge'), CHARGE_START_MS),
      window.setTimeout(() => setPhase('shatter'), SHATTER_START_MS),
      window.setTimeout(() => setPhase('reveal'), REVEAL_START_MS),
      window.setTimeout(() => setPhase('idle'), IDLE_START_MS),
    ]
    return () => timers.forEach(window.clearTimeout)
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

/* ─── Data generators ─── */

function createFragments(): FragmentData[] {
  return Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
    const baseAngle = (i / FRAGMENT_COUNT) * Math.PI * 2
    const angle = baseAngle + (Math.random() - 0.5) * 0.5
    return {
      id: i,
      angle,
      distance: 150 + Math.random() * 100,
      rotation: (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 180),
      shardIndex: i % 4,
    }
  })
}

function createConvergeMotes(): MoteData[] {
  return Array.from({ length: CONVERGE_MOTE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_MOTE_COUNT) * Math.PI * 2
    const distance = 200 + Math.random() * 80
    const startX = Math.cos(angle) * distance
    const startY = Math.sin(angle) * distance
    const perpAngle = angle + Math.PI / 2
    const offset = (Math.random() - 0.5) * 60
    return {
      id: i,
      startX,
      startY,
      midX: Math.cos(angle) * distance * 0.4 + Math.cos(perpAngle) * offset,
      midY: Math.sin(angle) * distance * 0.4 + Math.sin(perpAngle) * offset,
      size: 10 + Math.random() * 14,
      delay: (i / CONVERGE_MOTE_COUNT) * 0.6,
    }
  })
}

function createDustSpray(): DustData[] {
  return Array.from({ length: DUST_SPRAY_COUNT }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    distance: 80 + Math.random() * 160,
    speed: 0.5 + Math.random(),
    size: 3 + Math.random() * 5,
  }))
}

function createOrbitDust(): OrbitDustData[] {
  return Array.from({ length: ORBIT_DUST_PER_PRIZE }, (_, i) => ({
    id: i,
    angle: (i / ORBIT_DUST_PER_PRIZE) * 360,
    radius: 30 + Math.random() * 8,
    size: 2.5 + Math.random() * 2,
  }))
}

/* ═══════════════════════════════════════════════════
   CRYSTAL BODY — the main crystal element
   ═══════════════════════════════════════════════════ */

function CrystalBody({ phase }: { phase: ShatterPhase }) {
  const isCharging = phase === 'charge'
  const isGone = phase === 'shatter' || phase === 'reveal' || phase === 'idle'

  return (
    <m.div
      className="pf-crystal-shatter__crystal-wrap"
      initial={{ y: -150, rotate: -8, opacity: 0 }}
      animate={
        isGone
          ? { y: 0, rotate: 0, opacity: 0, scale: 0 }
          : isCharging
            ? { y: 0, rotate: 0, opacity: 1, scale: 1.06 }
            : { y: 0, rotate: 0, opacity: 1, scale: [1, 1.03, 1] }
      }
      transition={
        isGone
          ? { duration: 0.06 }
          : isCharging
            ? { scale: { duration: 1.0, ease: 'easeInOut' }, default: { duration: 0.8, ease: [0.2, 0, 0.1, 1] as const } }
            : { y: { duration: 0.8, ease: [0.2, 0, 0.1, 1] as const }, scale: { duration: 0.3, delay: 1.0, ease: 'easeInOut' }, default: { duration: 0.8, ease: [0.2, 0, 0.1, 1] as const } }
      }
    >
      <m.img
        src={crystalShatterBodyImage}
        alt=""
        aria-hidden="true"
        className={`pf-crystal-shatter__crystal-image ${isCharging ? 'pf-crystal-shatter__crystal-image--charging' : ''}`}
      />
      <div className="pf-crystal-shatter__crystal-glow" />
      {isCharging && (
        <m.div
          className="pf-crystal-shatter__vibration-wrap"
          animate={{ x: [-2, 2, -3, 3, -2, 2, -1, 1, 0] }}
          transition={{ duration: 0.25, repeat: Infinity, ease: 'linear', delay: 0.6 }}
        />
      )}
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   ORBITING DUST — tiny motes orbiting each prize
   ═══════════════════════════════════════════════════ */

function OrbitingDustMotes({ motes, delay }: { motes: OrbitDustData[]; delay: number }) {
  return (
    <div className="pf-crystal-shatter__orbit-dust">
      {motes.map((mote) => {
        const steps = 48
        const xPath = Array.from({ length: steps }, (_, k) => {
          const deg = mote.angle + (k / (steps - 1)) * 360
          return Math.cos((deg * Math.PI) / 180) * mote.radius
        })
        const yPath = Array.from({ length: steps }, (_, k) => {
          const deg = mote.angle + (k / (steps - 1)) * 360
          return Math.sin((deg * Math.PI) / 180) * mote.radius
        })
        return (
          <m.img
            key={mote.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className="pf-crystal-shatter__orbit-mote"
            style={{ '--mote-size': `${mote.size}px` } as CSSProperties}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.7, 0.7],
              x: xPath,
              y: yPath,
            }}
            transition={{
              opacity: { duration: 0.5, delay: delay + 0.4 + mote.id * 0.08 },
              x: { duration: 2.5, delay: delay + 0.4, repeat: Infinity, ease: 'linear' },
              y: { duration: 2.5, delay: delay + 0.4, repeat: Infinity, ease: 'linear' },
            }}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   PRIZE DISPLAY COMPONENTS
   ═══════════════════════════════════════════════════ */

function PrizeAura({ delay }: { delay: number }) {
  return (
    <m.div
      className="pf-crystal-shatter__prize-aura"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.4, 0.35], scale: [0.3, 1.1, 1] }}
      transition={{
        duration: 0.6,
        delay: delay + 0.1,
        times: [0, 0.4, 1] as const,
        ease: 'easeOut',
      }}
    />
  )
}

function CrystalFrameOverlay({ delay }: { delay: number }) {
  return (
    <m.img
      src={crystalShatterFrameImage}
      alt=""
      aria-hidden="true"
      className="pf-crystal-shatter__frame-image"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.7, scale: 1 }}
      transition={{ duration: 0.3, delay: delay + 0.5, ease: 'easeOut' }}
    />
  )
}

function PrizeText({ label, amount, delay }: { label: string; amount: string; delay: number }) {
  return (
    <m.div
      className="pf-crystal-shatter__prize-text"
      initial={{ opacity: 0, scale: 0.3, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay + 0.6,
        ease: [0.34, 1.56, 0.64, 1] as const,
      }}
    >
      <span className="pf-crystal-shatter__prize-label">{label}</span>
      <span className="pf-crystal-shatter__prize-amount">{amount}</span>
    </m.div>
  )
}

function Prize({ config, slot, claimed, claimIndex }: { config: PrizeConfig; slot: PrizeSlot; claimed: boolean; claimIndex: number }) {
  const amount = useCountUp(config.value ?? 0, 500, (slot.delay + 0.6) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null
  const motes = useMemo(() => createOrbitDust(), [])

  const streakX = slot.x * 0.5
  const streakY = -200

  return (
    <m.div
      className={`pf-crystal-shatter__prize ${config.modifier}`}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={
        claimed
          ? {
              x: [slot.x, slot.x, streakX],
              y: [slot.y, slot.y, streakY],
              scale: [1, 0.35, 0.15],
              opacity: [1, 1, 0],
            }
          : {
              x: [0, slot.x * 0.5, slot.x],
              y: [0, slot.y * 0.5, slot.y],
              scale: [0, 1.15, 1],
              opacity: [0, 1, 1],
            }
      }
      transition={
        claimed
          ? {
              duration: 0.75,
              delay: claimIndex * CLAIM_FLY_STAGGER,
              times: [0, 0.3, 1] as const,
              ease: [0.4, 0, 1, 1] as const,
            }
          : {
              duration: 0.5,
              delay: slot.delay,
              times: [0, 0.5, 1] as const,
              ease: [0.16, 0.84, 0.32, 1] as const,
            }
      }
    >
      <PrizeAura delay={slot.delay} />
      <div className="pf-crystal-shatter__prize-icon-wrap">
        <CrystalFrameOverlay delay={slot.delay} />
        <OrbitingDustMotes motes={motes} delay={slot.delay} />
        <m.img
          src={config.src}
          alt=""
          aria-hidden="true"
          className="pf-crystal-shatter__prize-icon"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0.95, 1], opacity: [0, 1, 1, 1] }}
          transition={{
            duration: 0.5,
            delay: slot.delay + 0.1,
            times: [0, 0.35, 0.65, 1] as const,
            ease: [0.16, 0.84, 0.32, 1] as const,
          }}
        />
      </div>
      {hasText && <PrizeText label={config.label!} amount={amount} delay={slot.delay} />}
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN ANIMATION
   ═══════════════════════════════════════════════════ */

function CrystalShatterAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const fragments = useMemo(() => createFragments(), [])
  const convergeMotes = useMemo(() => createConvergeMotes(), [])
  const dustSpray = useMemo(() => createDustSpray(), [])

  // Preload shard images so they're decoded before the shatter phase
  useEffect(() => {
    SHARD_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const slots = getPrizeSlots(prizeCount)

  const showChargeMotes = phase === 'charge'
  const showShatterEffects = phase === 'shatter' || phase === 'reveal' || phase === 'idle'
  const showPrizes = phase === 'reveal' || phase === 'idle'

  const [claimed, setClaimed] = useState(false)
  const [showClaim, setShowClaim] = useState(false)

  useEffect(() => {
    if (phase !== 'idle') return
    const t = window.setTimeout(() => setShowClaim(true), CLAIM_APPEAR_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  const handleClaim = () => setClaimed(true)

  return (
    <div className="pf-crystal-shatter__stage">
      <AmbientDust />
      <LandingRing />

      <CrystalBody phase={phase} />

      {showChargeMotes && <EnergyMotes motes={convergeMotes} />}

      {showShatterEffects && (
        <>
          <ShatterFlash />
          <PrismaticRingBurst />
          <CrystalFragments fragments={fragments} />
          <DustSpray particles={dustSpray} />
        </>
      )}

      {showPrizes && (
        <>
          {claimed && <ClaimBurst />}
          <div className="pf-crystal-shatter__prizes">
            {prizes.map((prize, i) => (
              <Prize key={prize.id} config={prize} slot={slots[i]} claimed={claimed} claimIndex={i} />
            ))}
          </div>
          <AnimatePresence>
            {showClaim && !claimed && <ClaimButton onClaim={handleClaim} />}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

function PrizeRevealCrystalShatterComponent({ prizeCount = DEFAULT_PRIZE_COUNT }: { prizeCount?: number }) {
  return (
    <div
      className="pf-modal-celebration pf-crystal-shatter"
      data-animation-id="prize-reveal__crystal-shatter"
      data-prize-count={prizeCount}
    >
      <CrystalShatterAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealCrystalShatter = memo(PrizeRevealCrystalShatterComponent)
