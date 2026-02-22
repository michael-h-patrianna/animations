import * as m from 'motion/react-m'
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  arcanePortalRingImage,
  dailyRewardFreeSpinsImage,
  dailyRewardGcImage,
  dailyRewardRandomRewardImage,
  dailyRewardScImage,
} from '@/assets'

type RevealPhase = 'materialize' | 'charge' | 'erupt'
type ParticleData = { id: number; startX: number; startY: number; size: number; delay: number }
type PrizeConfig = { id: string; label: string | null; src: string; value: number | null; decimals: number; modifier: string }
type PrizePosition = { flyX: number; overshootX: number; delay: number }

const CHARGE_DELAY_MS = 800
const ERUPT_DELAY_MS = 1400
const RAY_COUNT = 14
const RAY_INDICES = Array.from({ length: RAY_COUNT }, (_, i) => i)
const CONVERGE_PARTICLE_COUNT = 12
const RUNE_SYMBOLS = ['\u2726', '\u2727', '\u2728', '\u2736', '\u2737', '\u2738']
const RUNE_COUNT = 6
const DEFAULT_PRIZE_COUNT = 3

const PRIZE_POOL: PrizeConfig[] = [
  { id: 'gc', label: 'GC', src: dailyRewardGcImage, value: 1500, decimals: 0, modifier: 'pf-arcane-portal__prize--gc' },
  { id: 'sc', label: 'SC', src: dailyRewardScImage, value: 2.5, decimals: 2, modifier: 'pf-arcane-portal__prize--sc' },
  { id: 'fs', label: 'FS', src: dailyRewardFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-arcane-portal__prize--fs' },
  { id: 'rr', label: null, src: dailyRewardRandomRewardImage, value: null, decimals: 0, modifier: 'pf-arcane-portal__prize--rr' },
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
  const [phase, setPhase] = useState<RevealPhase>('materialize')
  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('charge'), CHARGE_DELAY_MS)
    const t2 = window.setTimeout(() => setPhase('erupt'), ERUPT_DELAY_MS)
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

function createConvergeParticles(): ParticleData[] {
  return Array.from({ length: CONVERGE_PARTICLE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_PARTICLE_COUNT) * Math.PI * 2
    const distance = 100 + Math.random() * 60
    return {
      id: i,
      startX: Math.cos(angle) * distance,
      startY: Math.sin(angle) * distance,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.3,
    }
  })
}

/* ─── Sub-components ─── */

function AmbientGlow() {
  return (
    <m.div
      className="pf-arcane-portal__ambient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
  )
}

function ConvergeParticles({ particles }: { particles: ParticleData[] }) {
  return (
    <div className="pf-arcane-portal__particles">
      {particles.map((p) => (
        <m.div
          key={p.id}
          className="pf-arcane-portal__particle"
          style={{ '--size': `${p.size}px` } as CSSProperties}
          initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0] }}
          transition={{ duration: 0.7, delay: p.delay, ease: [0.22, 1, 0.36, 1] as const }}
        />
      ))}
    </div>
  )
}

function InnerVortex({ phase }: { phase: RevealPhase }) {
  const isCharge = phase === 'charge'
  const isErupt = phase === 'erupt'
  return (
    <m.div
      className="pf-arcane-portal__vortex"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{
        opacity: isErupt ? 0 : isCharge ? [0.7, 1, 0.7] : [0, 0.7],
        scale: isErupt ? 1.8 : isCharge ? [1, 1.15, 1] : [0.3, 1],
      }}
      transition={{
        opacity: isCharge
          ? { duration: 0.5, repeat: Infinity, repeatType: 'reverse' as const }
          : { duration: isErupt ? 0.3 : 0.6 },
        scale: isCharge
          ? { duration: 0.5, repeat: Infinity, repeatType: 'reverse' as const }
          : { duration: isErupt ? 0.3 : 0.6, ease: 'easeOut' },
      }}
    />
  )
}

function PortalRing({ phase }: { phase: RevealPhase }) {
  const isCharge = phase === 'charge'
  const isErupt = phase === 'erupt'

  return (
    <m.div
      className="pf-arcane-portal__ring-wrap"
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{
        scale: isErupt ? [1, 1.15, 0.6] : isCharge ? [1, 1.08, 1] : [0, 1.1, 1],
        opacity: isErupt ? [1, 1, 0] : 1,
        rotate: isErupt ? [0, 5, -10] : 0,
      }}
      transition={
        isErupt
          ? { duration: 0.5, times: [0, 0.4, 1] as const, ease: 'easeOut' }
          : isCharge
            ? { duration: 0.8, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' }
            : { duration: 0.7, times: [0, 0.65, 1] as const, ease: [0.16, 0.84, 0.32, 1] as const }
      }
    >
      <m.div
        className="pf-arcane-portal__ring-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: isCharge ? [0.6, 1, 0.6] : isErupt ? 0 : 0.6 }}
        transition={
          isCharge
            ? { duration: 0.6, repeat: Infinity, repeatType: 'reverse' as const }
            : { duration: 0.4 }
        }
      />
      <m.img
        src={arcanePortalRingImage}
        alt=""
        aria-hidden="true"
        className="pf-arcane-portal__ring-image"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
    </m.div>
  )
}

function OrbitingRunes() {
  return (
    <div className="pf-arcane-portal__runes">
      {Array.from({ length: RUNE_COUNT }, (_, i) => {
        const angle = (i / RUNE_COUNT) * 360
        const radius = 90
        return (
          <m.span
            key={i}
            className="pf-arcane-portal__rune"
            initial={{
              opacity: 0,
              x: Math.cos((angle * Math.PI) / 180) * radius,
              y: Math.sin((angle * Math.PI) / 180) * radius,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.9, 0.9, 0],
              x: [
                Math.cos((angle * Math.PI) / 180) * radius,
                Math.cos(((angle + 120) * Math.PI) / 180) * radius,
                Math.cos(((angle + 240) * Math.PI) / 180) * radius,
                Math.cos(((angle + 360) * Math.PI) / 180) * (radius * 0.3),
              ],
              y: [
                Math.sin((angle * Math.PI) / 180) * radius,
                Math.sin(((angle + 120) * Math.PI) / 180) * radius,
                Math.sin(((angle + 240) * Math.PI) / 180) * radius,
                Math.sin(((angle + 360) * Math.PI) / 180) * (radius * 0.3),
              ],
              scale: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.08,
              times: [0, 0.15, 0.85, 1] as const,
              ease: 'linear',
            }}
          >
            {RUNE_SYMBOLS[i % RUNE_SYMBOLS.length]}
          </m.span>
        )
      })}
    </div>
  )
}

function Shockwave() {
  return (
    <m.div
      className="pf-arcane-portal__shockwave"
      initial={{ scale: 0.5, opacity: 1 }}
      animate={{ scale: [0.5, 3.5], opacity: [1, 0] }}
      transition={{ duration: 0.6, ease: [0.16, 0.84, 0.32, 1] as const }}
    />
  )
}

function BurstFlash() {
  return (
    <m.div
      className="pf-arcane-portal__burst"
      initial={{ opacity: 0, scale: 0.15 }}
      animate={{ opacity: [0, 0.95, 0], scale: [0.15, 1, 1.6] }}
      transition={{ duration: 0.55, times: [0, 0.2, 1] as const, ease: 'easeOut' }}
    />
  )
}

function PrizeRays() {
  return (
    <div className="pf-arcane-portal__prize-rays-wrap">
      <m.div
        className="pf-arcane-portal__prize-rays-spin"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 0.5, delay: 0.4 },
          scale: { duration: 0.5, delay: 0.4, ease: [0.16, 0.84, 0.32, 1] as const },
          rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
        }}
      >
        <m.div
          className="pf-arcane-portal__prize-rays"
          animate={{ opacity: [0.45, 0.82, 0.45], scale: [0.96, 1.06, 0.96] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {RAY_INDICES.map((i) => (
            <span key={i} className="pf-arcane-portal__prize-ray" style={{ '--ray-rotation': `${i * (360 / RAY_COUNT)}deg` } as CSSProperties} />
          ))}
        </m.div>
      </m.div>
    </div>
  )
}

function PrizeGlow({ delay }: { delay: number }) {
  return (
    <m.div
      className="pf-arcane-portal__prize-glow"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.85, 0.6], scale: [0.3, 1.15, 1] }}
      transition={{ duration: 0.55, delay: delay + 0.45, times: [0, 0.55, 1] as const, ease: 'easeOut' }}
    />
  )
}

function PrizeText({ label, amount, delay }: { label: string; amount: string; delay: number }) {
  return (
    <m.div
      className="pf-arcane-portal__prize-text"
      initial={{ opacity: 0, y: 10, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: delay + 0.55, ease: [0.16, 0.84, 0.32, 1] as const }}
    >
      <span className="pf-arcane-portal__prize-label">{label}</span>
      <span className="pf-arcane-portal__prize-amount">{amount}</span>
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
      className={`pf-arcane-portal__prize ${config.modifier}`}
      initial={{ x: '-50%', y: 80, scale: 0, opacity: 0 }}
      animate={{ x: xFrames, y: [80, -14, 6, 0], scale: [0, 1.18, 0.92, 1], opacity: [0, 1, 1, 1] }}
      transition={{ duration: 0.9, delay: position.delay, times: [0, 0.45, 0.75, 1] as const, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <div className="pf-arcane-portal__prize-icon-wrap">
        <PrizeGlow delay={position.delay} />
        <PrizeRays />
        <img src={config.src} alt="" aria-hidden="true" className="pf-arcane-portal__prize-icon" />
      </div>
      {hasText && <PrizeText label={config.label!} amount={amount} delay={position.delay} />}
    </m.div>
  )
}

function PortalAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const particles = useMemo(() => createConvergeParticles(), [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const positions = getPrizePositions(prizeCount)

  return (
    <div className="pf-arcane-portal__stage">
      <AmbientGlow />
      <ConvergeParticles particles={particles} />
      <InnerVortex phase={phase} />
      <PortalRing phase={phase} />
      {phase === 'charge' && <OrbitingRunes />}
      {phase === 'erupt' && (
        <>
          <Shockwave />
          <BurstFlash />
          <div className="pf-arcane-portal__prizes">
            {prizes.map((prize, i) => (
              <Prize key={prize.id} config={prize} position={positions[i]} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PrizeRevealArcanePortalComponent({ prizeCount = DEFAULT_PRIZE_COUNT }: { prizeCount?: number }) {
  return (
    <div
      className="pf-modal-celebration pf-arcane-portal"
      data-animation-id="prize-reveal__arcane-portal"
      data-prize-count={prizeCount}
    >
      <PortalAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealArcanePortal = memo(PrizeRevealArcanePortalComponent)
