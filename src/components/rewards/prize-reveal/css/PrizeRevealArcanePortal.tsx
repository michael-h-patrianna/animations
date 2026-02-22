import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  arcanePortalRingImage,
  dailyRewardFreeSpinsImage,
  dailyRewardGcImage,
  dailyRewardRandomRewardImage,
  dailyRewardScImage,
} from '@/assets'

import './PrizeRevealArcanePortal.css'

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
  { id: 'gc', label: 'GC', src: dailyRewardGcImage, value: 1500, decimals: 0, modifier: 'pf-arcane-portal-css__prize--gc' },
  { id: 'sc', label: 'SC', src: dailyRewardScImage, value: 2.5, decimals: 2, modifier: 'pf-arcane-portal-css__prize--sc' },
  { id: 'fs', label: 'FS', src: dailyRewardFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-arcane-portal-css__prize--fs' },
  { id: 'rr', label: null, src: dailyRewardRandomRewardImage, value: null, decimals: 0, modifier: 'pf-arcane-portal-css__prize--rr' },
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
  return (
    <div className="pf-arcane-portal-css__runes">
      {Array.from({ length: RUNE_COUNT }, (_, i) => {
        const angle = (i / RUNE_COUNT) * 360
        const radius = 90
        const x = Math.cos((angle * Math.PI) / 180) * radius
        const y = Math.sin((angle * Math.PI) / 180) * radius
        return (
          <span
            key={i}
            className="pf-arcane-portal-css__rune"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              '--rune-delay': `${i * 0.08}s`,
            } as CSSProperties}
          >
            {RUNE_SYMBOLS[i % RUNE_SYMBOLS.length]}
          </span>
        )
      })}
    </div>
  )
}

function PrizeRays() {
  return (
    <div className="pf-arcane-portal-css__prize-rays-wrap">
      <div className="pf-arcane-portal-css__prize-rays-spin">
        <div className="pf-arcane-portal-css__prize-rays">
          {RAY_INDICES.map((i) => (
            <span key={i} className="pf-arcane-portal-css__prize-ray" style={{ '--ray-rotation': `${i * (360 / RAY_COUNT)}deg` } as CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Prize({ config, position }: { config: PrizeConfig; position: PrizePosition }) {
  const amount = useCountUp(config.value ?? 0, 600, (position.delay + 0.6) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null

  return (
    <div
      className={`pf-arcane-portal-css__prize ${config.modifier}`}
      style={{
        '--fly-x': `${position.flyX}px`,
        '--fly-overshoot': `${position.overshootX}px`,
        '--fly-settle': `${position.flyX * 0.95}px`,
        '--fly-delay': `${position.delay}s`,
        '--glow-delay': `${position.delay + 0.45}s`,
        '--rays-delay': `${position.delay + 0.4}s`,
        '--text-delay': `${position.delay + 0.55}s`,
      } as CSSProperties}
    >
      <div className="pf-arcane-portal-css__prize-icon-wrap">
        <div className="pf-arcane-portal-css__prize-glow" />
        <PrizeRays />
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

function PortalAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const particles = useMemo(() => createConvergeParticles(), [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const positions = getPrizePositions(prizeCount)

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
      className="pf-modal-celebration pf-arcane-portal-css"
      data-animation-id="prize-reveal__arcane-portal"
      data-prize-count={prizeCount}
    >
      <PortalAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealArcanePortal = memo(PrizeRevealArcanePortalComponent)
