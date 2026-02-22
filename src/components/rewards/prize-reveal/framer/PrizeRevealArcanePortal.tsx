import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  arcanePortalFreeSpinsImage,
  arcanePortalGcImage,
  arcanePortalRandomRewardImage,
  arcanePortalRingImage,
  arcanePortalRunicSigilImage,
  arcanePortalScImage,
} from '@/assets'

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
  { id: 'gc', label: 'GC', src: arcanePortalGcImage, value: 1500, decimals: 0, modifier: 'pf-arcane-portal__prize--gc' },
  { id: 'sc', label: 'SC', src: arcanePortalScImage, value: 2.5, decimals: 2, modifier: 'pf-arcane-portal__prize--sc' },
  { id: 'fs', label: 'FS', src: arcanePortalFreeSpinsImage, value: 50, decimals: 0, modifier: 'pf-arcane-portal__prize--fs' },
  { id: 'rr', label: null, src: arcanePortalRandomRewardImage, value: null, decimals: 0, modifier: 'pf-arcane-portal__prize--rr' },
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

/* ═══════════════════════════════════════════════════
   PORTAL INTRO — ambient, particles, vortex, ring, runes
   ═══════════════════════════════════════════════════ */

function AmbientGlow() {
  return (
    <m.div
      className="pf-arcane-portal__ambient"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.7, 1] }}
      transition={{ duration: 0.6, times: [0, 0.5, 1] as const }}
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
          animate={{ x: 0, y: 0, opacity: [0, 0.9, 1, 0], scale: [0, 1.3, 1, 0] }}
          transition={{ duration: 0.7, delay: p.delay, ease: [0.22, 1, 0.36, 1] as const }}
        />
      ))}
    </div>
  )
}

function InnerVortex({ phase }: { phase: RevealPhase }) {
  return (
    <m.div
      className="pf-arcane-portal__vortex"
      animate={{
        opacity: phase === 'erupt' ? 0 : phase === 'charge' ? 0.95 : 0.75,
        scale: phase === 'erupt' ? 2.5 : phase === 'charge' ? 1.15 : 1,
      }}
      transition={{
        duration: phase === 'erupt' ? 0.4 : 0.6,
        ease: 'easeOut',
      }}
    />
  )
}

function PortalRing({ phase }: { phase: RevealPhase }) {
  return (
    <m.div
      className="pf-arcane-portal__ring-wrap"
      initial={{ scale: 0, opacity: 0, rotate: -30 }}
      animate={{
        scale: phase === 'erupt' ? 0.4 : phase === 'charge' ? 1.08 : 1,
        opacity: phase === 'erupt' ? 0 : 1,
        rotate: phase === 'erupt' ? -12 : 0,
      }}
      transition={{
        duration: phase === 'erupt' ? 0.45 : phase === 'charge' ? 0.8 : 0.7,
        ease: phase === 'materialize' ? [0.16, 0.84, 0.32, 1] as const : 'easeInOut',
      }}
    >
      <m.div
        className="pf-arcane-portal__ring-glow"
        animate={{
          opacity: phase === 'erupt' ? 0 : phase === 'charge' ? 1 : 0.7,
        }}
        transition={{ duration: 0.5 }}
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
    <>
      {Array.from({ length: RUNE_COUNT }, (_, i) => {
        const startAngle = (i / RUNE_COUNT) * 360
        const radius = 105
        return (
          <m.span
            key={i}
            className="pf-arcane-portal__rune"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.95, 0.95, 0],
              scale: [0, 1.1, 1, 0],
              x: [
                Math.cos((startAngle * Math.PI) / 180) * radius,
                Math.cos(((startAngle + 120) * Math.PI) / 180) * radius,
                Math.cos(((startAngle + 240) * Math.PI) / 180) * radius,
                Math.cos(((startAngle + 360) * Math.PI) / 180) * (radius * 0.15),
              ],
              y: [
                Math.sin((startAngle * Math.PI) / 180) * radius,
                Math.sin(((startAngle + 120) * Math.PI) / 180) * radius,
                Math.sin(((startAngle + 240) * Math.PI) / 180) * radius,
                Math.sin(((startAngle + 360) * Math.PI) / 180) * (radius * 0.15),
              ],
            }}
            exit={{
              opacity: 0,
              scale: 0,
              transition: { duration: 0.25 },
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.05,
              times: [0, 0.1, 0.8, 1] as const,
              ease: 'linear',
            }}
          >
            {RUNE_SYMBOLS[i % RUNE_SYMBOLS.length]}
          </m.span>
        )
      })}
    </>
  )
}

function Shockwave() {
  return (
    <m.div
      className="pf-arcane-portal__shockwave"
      initial={{ scale: 0.3, opacity: 1 }}
      animate={{ scale: 5, opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 0.84, 0.32, 1] as const }}
    />
  )
}

function BurstFlash() {
  return (
    <m.div
      className="pf-arcane-portal__burst"
      initial={{ opacity: 0, scale: 0.1 }}
      animate={{ opacity: [0, 1, 0], scale: [0.1, 1.2, 2] }}
      transition={{ duration: 0.55, times: [0, 0.12, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   PRIZE COMPONENTS — descend from portal, materialize
   with runic sigil + orbiting motes + aura glow
   ═══════════════════════════════════════════════════ */

function OrbitingMotes({ motes, delay }: { motes: MoteData[]; delay: number }) {
  return (
    <div className="pf-arcane-portal__motes">
      {motes.map((mote) => {
        const r = mote.radius
        const a = mote.angle
        const steps = 60
        const xPath = Array.from({ length: steps }, (_, k) => {
          const deg = a + (k / (steps - 1)) * 360
          return Math.cos((deg * Math.PI) / 180) * r
        })
        const yPath = Array.from({ length: steps }, (_, k) => {
          const deg = a + (k / (steps - 1)) * 360
          return Math.sin((deg * Math.PI) / 180) * r
        })
        return (
          <m.div
            key={mote.id}
            className="pf-arcane-portal__mote"
            style={{ '--mote-size': `${mote.size}px` } as CSSProperties}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0.9],
              x: xPath,
              y: yPath,
            }}
            transition={{
              opacity: { duration: 0.5, delay: delay + 0.35 + mote.id * 0.05 },
              x: { duration: 2.2, delay: delay + 0.35, repeat: Infinity, ease: 'linear' },
              y: { duration: 2.2, delay: delay + 0.35, repeat: Infinity, ease: 'linear' },
            }}
          />
        )
      })}
    </div>
  )
}

function PrizeAura({ delay }: { delay: number }) {
  return (
    <m.div
      className="pf-arcane-portal__prize-aura"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.8, 0.6], scale: [0.3, 1.1, 1] }}
      transition={{
        duration: 0.7,
        delay: delay + 0.05,
        times: [0, 0.4, 1] as const,
        ease: 'easeOut',
      }}
    />
  )
}

function RunicSigil({ delay }: { delay: number }) {
  return (
    <m.div
      className="pf-arcane-portal__sigil-wrap"
      initial={{ opacity: 0, scale: 0, rotate: -60 }}
      animate={{ opacity: 0.75, scale: 1, rotate: 0 }}
      transition={{
        duration: 0.65,
        delay: delay + 0.1,
        ease: [0.16, 0.84, 0.32, 1] as const,
      }}
    >
      <m.img
        src={arcanePortalRunicSigilImage}
        alt=""
        aria-hidden="true"
        className="pf-arcane-portal__sigil-image"
        animate={{ rotate: 360, opacity: [0.55, 0.85, 0.55] }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </m.div>
  )
}

function MaterializeFlash({ delay }: { delay: number }) {
  return (
    <m.div
      className="pf-arcane-portal__materialize-ring"
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 1, 0], scale: [0.2, 1.4, 2] }}
      transition={{
        duration: 0.5,
        delay,
        times: [0, 0.25, 1] as const,
        ease: 'easeOut',
      }}
    />
  )
}

function PrizeText({ label, amount, delay }: { label: string; amount: string; delay: number }) {
  return (
    <m.div
      className="pf-arcane-portal__prize-text"
      initial={{ opacity: 0, scale: 0.3, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: delay + 0.4,
        ease: [0.34, 1.56, 0.64, 1] as const,
      }}
    >
      <span className="pf-arcane-portal__prize-label">{label}</span>
      <span className="pf-arcane-portal__prize-amount">{amount}</span>
    </m.div>
  )
}

function Prize({ config, slot }: { config: PrizeConfig; slot: PrizeSlot }) {
  const amount = useCountUp(config.value ?? 0, 700, (slot.delay + 0.5) * 1000, config.decimals)
  const hasText = config.label != null && config.value != null
  const motes = useMemo(() => createOrbitMotes(), [])

  return (
    <m.div
      className={`pf-arcane-portal__prize ${config.modifier}`}
      initial={{ x: 0, y: -90, scale: 0, opacity: 0 }}
      animate={{
        x: [0, slot.x * 0.3, slot.x * 0.75, slot.x],
        y: [-90, -30, slot.y * 0.6, slot.y],
        scale: [0, 0.4, 1.1, 1],
        opacity: [0, 0.7, 1, 1],
      }}
      transition={{
        duration: 0.9,
        delay: slot.delay,
        times: [0, 0.25, 0.65, 1] as const,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
    >
      <PrizeAura delay={slot.delay} />
      <div className="pf-arcane-portal__prize-icon-wrap">
        <MaterializeFlash delay={slot.delay} />
        <RunicSigil delay={slot.delay} />
        <OrbitingMotes motes={motes} delay={slot.delay} />
        <m.img
          src={config.src}
          alt=""
          aria-hidden="true"
          className="pf-arcane-portal__prize-icon"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0.93, 1], opacity: [0, 1, 1, 1] }}
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
   MAIN
   ═══════════════════════════════════════════════════ */

function PortalAnimation({ prizeCount }: { prizeCount: number }) {
  const phase = useRevealPhase()
  const particles = useMemo(() => createConvergeParticles(), [])
  const prizes = PRIZE_POOL.slice(0, prizeCount)
  const slots = getPrizeSlots(prizeCount)
  const showRunes = phase === 'charge'
  const showPrizes = phase === 'erupt'

  return (
    <div className="pf-arcane-portal__stage">
      <AmbientGlow />
      <ConvergeParticles particles={particles} />
      <InnerVortex phase={phase} />
      <PortalRing phase={phase} />

      {/* Runes wrap — AnimatePresence enables smooth exit */}
      <div className="pf-arcane-portal__runes">
        <AnimatePresence>
          {showRunes && <OrbitingRunes />}
        </AnimatePresence>
      </div>

      {showPrizes && (
        <>
          <Shockwave />
          <BurstFlash />
          <div className="pf-arcane-portal__prizes">
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
      className="pf-modal-celebration pf-arcane-portal"
      data-animation-id="prize-reveal__arcane-portal"
      data-prize-count={prizeCount}
    >
      <PortalAnimation prizeCount={prizeCount} />
    </div>
  )
}

export const PrizeRevealArcanePortal = memo(PrizeRevealArcanePortalComponent)
