import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  arcanePortalFreeSpinsImage,
  arcanePortalGcImage,
  arcanePortalRandomRewardImage,
  arcanePortalRingImage,
  arcanePortalRunicSigilImage,
  arcanePortalScImage,
} from '@/assets'

import './PrizeRevealArcanePortal.css'

/* ─── Types ─── */

type RevealPhase = 'materialize' | 'charge' | 'erupt'
type ParticleData = { id: number; startX: number; startY: number; size: number; delay: number }
type MoteData = { id: number; angle: number; radius: number; size: number }
type PrizeConfig = { id: string; label: string | null; src: string; value: number | null; decimals: number; modifier: string }
type PrizeSlot = { x: number; y: number; delay: number }

/* ─── Constants ─── */

const CHARGE_DELAY_MS = 700
const ERUPT_DELAY_MS = 1500
const CONVERGE_PARTICLE_COUNT = 20
const RUNE_SYMBOLS = ['\u2726', '\u2727', '\u2728', '\u2736', '\u2737', '\u2738']
const RUNE_COUNT = 8
const MOTES_PER_PRIZE = 6
const DEFAULT_PRIZE_COUNT = 3

const PRIZE_POOL: PrizeConfig[] = [
  { id: 'gc', label: 'GC', src: arcanePortalGcImage, value: 1500, decimals: 0, modifier: 'pf-arcane-portal-css__prize--gc' },
  { id: 'sc', label: 'SC', src: arcanePortalScImage, value: 2.5, decimals: 2, modifier: 'pf-arcane-portal-css__prize--sc' },
  { id: 'fs', label: 'FS', src: arcanePortalFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-arcane-portal-css__prize--fs' },
  { id: 'rr', label: null, src: arcanePortalRandomRewardImage, value: null, decimals: 0, modifier: 'pf-arcane-portal-css__prize--rr' },
]

function getPrizeSlots(count: number): PrizeSlot[] {
  const layouts: Record<number, PrizeSlot[]> = {
    1: [{ x: 0, y: 30, delay: 0 }],
    2: [
      { x: -72, y: 28, delay: 0 },
      { x: 72, y: 28, delay: 0.1 },
    ],
    3: [
      { x: -88, y: 32, delay: 0 },
      { x: 0, y: 22, delay: 0.08 },
      { x: 88, y: 32, delay: 0.16 },
    ],
    4: [
      { x: -110, y: 34, delay: 0 },
      { x: -37, y: 24, delay: 0.07 },
      { x: 37, y: 24, delay: 0.14 },
      { x: 110, y: 34, delay: 0.21 },
    ],
  }
  return layouts[count] ?? layouts[DEFAULT_PRIZE_COUNT]
}

/* ─── Hooks ─── */

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

/* ─── Data generators ─── */

function createConvergeParticles(): ParticleData[] {
  return Array.from({ length: CONVERGE_PARTICLE_COUNT }, (_, i) => {
    const angle = (i / CONVERGE_PARTICLE_COUNT) * Math.PI * 2
    const distance = 120 + Math.random() * 60
    return {
      id: i,
      startX: Math.cos(angle) * distance,
      startY: Math.sin(angle) * distance,
      size: 2.5 + Math.random() * 3.5,
      delay: Math.random() * 0.3,
    }
  })
}

function createOrbitMotes(): MoteData[] {
  return Array.from({ length: MOTES_PER_PRIZE }, (_, i) => ({
    id: i,
    angle: (i / MOTES_PER_PRIZE) * 360,
    radius: 34 + Math.random() * 10,
    size: 2.5 + Math.random() * 2.5,
  }))
}

/* ─── Sub-components ─── */

function ConvergeParticles({ particles }: { particles: ParticleData[] }) {
  return (
    <div className="pf-arcane-portal-css__particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="pf-arcane-portal-css__particle"
          style={{
            '--size': `${p.size}px`,
            '--start-x': `${p.startX}px`,
            '--start-y': `${p.startY}px`,
            '--p-delay': `${p.delay}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

function OrbitingRunes() {
  const radius = 105
  return (
    <div className="pf-arcane-portal-css__runes">
      {Array.from({ length: RUNE_COUNT }, (_, i) => {
        const startAngle = (i / RUNE_COUNT) * 360
        const a0 = startAngle
        const a1 = startAngle + 120
        const a2 = startAngle + 240
        const a3 = startAngle + 360
        return (
          <span
            key={i}
            className="pf-arcane-portal-css__rune"
            style={{
              '--rune-delay': `${i * 0.05}s`,
              '--rx0': `${Math.cos((a0 * Math.PI) / 180) * radius}px`,
              '--ry0': `${Math.sin((a0 * Math.PI) / 180) * radius}px`,
              '--rx1': `${Math.cos((a1 * Math.PI) / 180) * radius}px`,
              '--ry1': `${Math.sin((a1 * Math.PI) / 180) * radius}px`,
              '--rx2': `${Math.cos((a2 * Math.PI) / 180) * radius}px`,
              '--ry2': `${Math.sin((a2 * Math.PI) / 180) * radius}px`,
              '--rx3': `${Math.cos((a3 * Math.PI) / 180) * (radius * 0.15)}px`,
              '--ry3': `${Math.sin((a3 * Math.PI) / 180) * (radius * 0.15)}px`,
            } as CSSProperties}
          >
            {RUNE_SYMBOLS[i % RUNE_SYMBOLS.length]}
          </span>
        )
      })}
    </div>
  )
}

function OrbitingMotesCss({ motes, delay }: { motes: MoteData[]; delay: number }) {
  return (
    <div
      className="pf-arcane-portal-css__motes-orbit"
      style={{ '--mote-orbit-delay': `${delay + 0.35}s` } as CSSProperties}
    >
      {motes.map((mote) => (
        <div
          key={mote.id}
          className="pf-arcane-portal-css__mote"
          style={{
            '--mote-size': `${mote.size}px`,
            '--mote-x': `${Math.cos((mote.angle * Math.PI) / 180) * mote.radius}px`,
            '--mote-y': `${Math.sin((mote.angle * Math.PI) / 180) * mote.radius}px`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

function Prize({ config, slot }: { config: PrizeConfig; slot: PrizeSlot }) {
  const amount = useCountUp(config.value ?? 0, 700, (slot.delay + 0.5) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null
  const motes = useMemo(() => createOrbitMotes(), [])

  return (
    <div
      className={`pf-arcane-portal-css__prize ${config.modifier}`}
      style={{
        '--slot-x': `${slot.x}px`,
        '--slot-y': `${slot.y}px`,
        '--slot-x-30': `${slot.x * 0.3}px`,
        '--slot-x-75': `${slot.x * 0.75}px`,
        '--slot-y-60': `${slot.y * 0.6}px`,
        '--prize-delay': `${slot.delay}s`,
        '--aura-delay': `${slot.delay + 0.05}s`,
        '--sigil-delay': `${slot.delay + 0.1}s`,
        '--icon-delay': `${slot.delay + 0.1}s`,
        '--flash-delay': `${slot.delay}s`,
        '--text-delay': `${slot.delay + 0.4}s`,
      } as CSSProperties}
    >
      <div className="pf-arcane-portal-css__prize-aura" />
      <div className="pf-arcane-portal-css__prize-icon-wrap">
        <div className="pf-arcane-portal-css__materialize-ring" />
        <div className="pf-arcane-portal-css__sigil-wrap">
          <img src={arcanePortalRunicSigilImage} alt="" aria-hidden="true" className="pf-arcane-portal-css__sigil-image" />
        </div>
        <OrbitingMotesCss motes={motes} delay={slot.delay} />
        <img src={config.src} alt="" aria-hidden="true" className="pf-arcane-portal-css__prize-icon" />
      </div>
      {hasText && (
        <div className="pf-arcane-portal-css__prize-text">
          <span className="pf-arcane-portal-css__prize-label">{config.label}</span>
          <span className="pf-arcane-portal-css__prize-amount">{amount}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Main ─── */

function PortalAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const particles = useMemo(() => createConvergeParticles(), [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const slots = getPrizeSlots(prizeCount)

  const ringClass = `pf-arcane-portal-css__ring-wrap${phase === 'charge' ? ' is-charge' : ''}${phase === 'erupt' ? ' is-erupt' : ''}`
  const vortexClass = `pf-arcane-portal-css__vortex${phase === 'charge' ? ' is-charge' : ''}${phase === 'erupt' ? ' is-erupt' : ''}`

  return (
    <div className="pf-arcane-portal-css__stage">
      <div className="pf-arcane-portal-css__ambient" />
      <ConvergeParticles particles={particles} />
      <div className={vortexClass} />
      <div className={ringClass}>
        <div className="pf-arcane-portal-css__ring-glow" />
        <img src={arcanePortalRingImage} alt="" aria-hidden="true" className="pf-arcane-portal-css__ring-image" />
      </div>
      {phase === 'charge' && <OrbitingRunes />}
      {phase === 'erupt' && (
        <>
          <div className="pf-arcane-portal-css__shockwave" />
          <div className="pf-arcane-portal-css__burst" />
          <div className="pf-arcane-portal-css__prizes">
            {prizes.map((prize, i) => (
              <Prize key={prize.id} config={prize} slot={slots[i]} />
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
      className="pf-modal-celebration pf-arcane-portal-css"
      data-animation-id="prize-reveal__arcane-portal"
      data-prize-count={prizeCount}
    >
      <PortalAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealArcanePortal = memo(PrizeRevealArcanePortalComponent)
