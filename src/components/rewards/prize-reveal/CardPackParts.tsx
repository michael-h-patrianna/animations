import * as m from 'motion/react-m'
import { type CSSProperties } from 'react'

import {
  crystalShatterDustImage,
  crystalShatterPrismaticRingImage,
  crystalShatterSparkleImage,
} from '@/assets'

/* ─── Shared types ─── */

/**
 *
 */
export type PackPhase = 'arrival' | 'anticipation' | 'burst' | 'fan' | 'flip' | 'idle'

/**
 *
 */
export type CardRarity = 1 | 2 | 3 | 4 | 5

/**
 *
 */
export type CardData = {
  id: number
  name: string
  rarity: CardRarity
  frontImage: string
  setId?: string
  isNew?: boolean
}

/**
 *
 */
export type FanPosition = { x: number; y: number; rotate: number }

/**
 *
 */
export type ConfettiData = {
  id: number
  angle: number
  distance: number
  rotation: number
  size: number
}

/* ─── Constants ─── */

const RARITY_COLORS: Record<CardRarity, { glow: string }> = {
  1: { glow: 'var(--rarity-common-glow)' },
  2: { glow: 'var(--rarity-uncommon-glow)' },
  3: { glow: 'var(--rarity-rare-glow)' },
  4: { glow: 'var(--rarity-epic-glow)' },
  5: { glow: 'var(--rarity-legendary-glow)' },
}


/* Tear edge — irregular rip with varied amplitude, spacing, and wandering baseline.
   Points shared between flap (above) and body (below) so they mesh seamlessly. */
const TEAR_EDGE = [
  [0, 30], [5, 24], [10, 31], [16, 22], [22, 29],
  [28, 34], [35, 23], [42, 30], [48, 21], [55, 32],
  [62, 25], [68, 34], [75, 22], [82, 31], [88, 24],
  [94, 33], [100, 27],
] as const

const TEAR_FLAP_CLIP = `polygon(0% 0%, 100% 0%, ${[...TEAR_EDGE].reverse().map(([x, y]) => `${x}% ${y}%`).join(', ')})`
const TEAR_BODY_CLIP = `polygon(${TEAR_EDGE.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 0% 100%)`

/* ═══════════════════════════════════════════════════
   PACK BODY — drop in with squash-stretch, shake + bulge
   ═══════════════════════════════════════════════════ */

/** Escalating shake — amplitude ramps from gentle tremor to violent judder.
    scaleX oscillates alongside to simulate internal pressure bulging the pack. */
const SHAKE_STEPS = 30
const SHAKE_KEYFRAMES = (() => {
  const x: number[] = []
  const y: number[] = []
  const rot: number[] = []
  const sx: number[] = []
  for (let i = 0; i <= SHAKE_STEPS; i++) {
    const t = i / SHAKE_STEPS
    const amp = 1 + t * 5
    const rotAmp = 0.3 + t * 1.7
    const sign = i % 2 === 0 ? 1 : -1
    const jitter = 0.6 + Math.random() * 0.4
    x.push(sign * amp * jitter * (0.8 + Math.random() * 0.4))
    y.push(-sign * amp * jitter * 0.5)
    rot.push(sign * rotAmp * jitter)
    // Bulge: oscillates between 1.0 and up to 1.04, growing with t
    sx.push(1 + (i % 2 === 0 ? t * 0.04 : 0))
  }
  x[SHAKE_STEPS] = 0
  y[SHAKE_STEPS] = 0
  rot[SHAKE_STEPS] = 0
  sx[SHAKE_STEPS] = 1
  return { x, y, rot, sx }
})()

/**
 *
 */
export function PackBody({ phase, packImage }: { phase: PackPhase; packImage: string }) {
  const isShaking = phase === 'anticipation'
  const isVisible = phase === 'arrival' || phase === 'anticipation'

  if (!isVisible) return null

  return (
    <m.div
      className="pf-card-pack__pack-body"
      initial={{ y: -180, scaleX: 0.5, scaleY: 0.5, opacity: 0 }}
      animate={{
        y: 0,
        scaleX: [0.5, 1, 1.06, 0.98, 1],
        scaleY: [0.5, 1, 0.94, 1.02, 1],
        opacity: 1,
      }}
      transition={{
        y: { duration: 0.6, ease: [0.16, 0.84, 0.32, 1] },
        scaleX: { duration: 0.75, times: [0, 0.7, 0.82, 0.92, 1], ease: 'easeOut' },
        scaleY: { duration: 0.75, times: [0, 0.7, 0.82, 0.92, 1], ease: 'easeOut' },
        opacity: { duration: 0.35 },
      }}
    >
      <m.div
        animate={
          isShaking
            ? {
                x: SHAKE_KEYFRAMES.x,
                y: SHAKE_KEYFRAMES.y,
                rotate: SHAKE_KEYFRAMES.rot,
                scaleX: SHAKE_KEYFRAMES.sx,
              }
            : {}
        }
        transition={isShaking ? { duration: 1.0, ease: 'linear' } : {}}
      >
        <img src={packImage} alt="" aria-hidden="true" className="pf-card-pack__pack-image" />
      </m.div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   SEAM LIGHT — horizontal glow at pack's tear line
   Light escaping from inside as pressure builds
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function SeamLight({ phase }: { phase: PackPhase }) {
  if (phase !== 'anticipation') return null

  return (
    <m.div
      className="pf-card-pack__seam"
      initial={{ opacity: 0, scaleX: 0.2 }}
      animate={{ opacity: [0, 0.4, 0.7, 1], scaleX: [0.2, 0.5, 0.8, 1.2] }}
      transition={{ duration: 1.0, times: [0, 0.3, 0.7, 1] as const, ease: 'easeIn' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   ARRIVAL DUST — impact particles when the pack lands
   ═══════════════════════════════════════════════════ */

const ARRIVAL_DUST_COUNT = 5

/**
 *
 */
export function ArrivalDust() {
  const particles = Array.from({ length: ARRIVAL_DUST_COUNT }, (_, i) => {
    const angle = (150 + (i / (ARRIVAL_DUST_COUNT - 1)) * 240) * (Math.PI / 180)
    const dist = 20 + Math.random() * 30
    return {
      id: i,
      endX: Math.cos(angle) * dist,
      endY: Math.sin(angle) * Math.abs(Math.sin(angle)) * dist * 0.6,
      size: 3 + Math.random() * 3,
    }
  })

  return (
    <div className="pf-card-pack__arrival-dust-container">
      {particles.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__arrival-dust"
          style={{ '--dust-size': `${p.size}px` } as CSSProperties}
          initial={{ x: 0, y: 0, opacity: 0.7, scale: 1 }}
          animate={{
            x: p.endX,
            y: p.endY,
            opacity: [0.7, 0.4, 0],
            scale: [1, 0.5, 0.1],
          }}
          transition={{
            duration: 0.35,
            delay: 0.55 + Math.random() * 0.06,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EDGE SPARKS — sparkles escaping from the seam area
   Concentrated near the tear line, not from all edges
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function EdgeSparks() {
  const packW = 72
  const seamY = -20 // near the tear line (~30% up from center)

  const sparks = Array.from({ length: 4 }, (_, i) => {
    // All sparks originate from the seam region
    const side = i % 2 === 0 ? 1 : -1
    const startX = side * (packW * 0.3 + Math.random() * packW * 0.7)
    const startY = seamY + (Math.random() - 0.5) * 20
    return {
      id: i,
      startX,
      startY,
      endX: startX + side * (15 + Math.random() * 25),
      endY: startY - 10 - Math.random() * 30,
      size: 6 + Math.random() * 6,
      delay: 0.2 + i * 0.2,
    }
  })

  return (
    <div className="pf-card-pack__edge-spark-container">
      {sparks.map((s) => (
        <m.img
          key={s.id}
          src={crystalShatterSparkleImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__edge-spark"
          style={{ '--spark-size': `${s.size}px` } as CSSProperties}
          initial={{ x: s.startX, y: s.startY, opacity: 0, scale: 0 }}
          animate={{
            x: s.endX,
            y: s.endY,
            opacity: [0, 0.9, 0],
            scale: [0, 1.2, 0.2],
          }}
          transition={{
            duration: 0.3,
            delay: s.delay,
            times: [0, 0.3, 1] as const,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SEAM CRACKS — fracture lines from the seam
   Appear progressively to show the pack rupturing
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function SeamCracks() {
  const cracks = [
    { id: 0, x: '30%', rotate: -25, len: 16, delay: 0.3 },
    { id: 1, x: '65%', rotate: 18, len: 22, delay: 0.55 },
    { id: 2, x: '45%', rotate: -40, len: 18, delay: 0.8 },
  ]

  return (
    <div className="pf-card-pack__seam-crack-container">
      {cracks.map((c) => (
        <m.div
          key={c.id}
          className="pf-card-pack__seam-crack"
          style={{
            insetInlineStart: c.x,
            rotate: `${c.rotate}deg`,
            '--crack-len': `${c.len}px`,
          } as CSSProperties}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1], opacity: [0, 0.8, 0.6] }}
          transition={{ duration: 0.25, delay: c.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   PACK TEAR OPEN — top-rip with jagged tear line
   Flap tears upward, body drops — the hero moment
   ═══════════════════════════════════════════════════ */

const TEAR_DEBRIS_COUNT = 7

function TearDebris() {
  const particles = Array.from({ length: TEAR_DEBRIS_COUNT }, (_, i) => {
    const spread = (i / (TEAR_DEBRIS_COUNT - 1)) * 140 - 70
    const isSparkle = i % 3 === 0
    return {
      id: i,
      x: spread + (Math.random() - 0.5) * 20,
      endX: spread * 1.4 + (Math.random() - 0.5) * 30,
      endY: -40 - Math.random() * 60,
      size: isSparkle ? 8 + Math.random() * 6 : 3 + Math.random() * 4,
      src: isSparkle ? crystalShatterSparkleImage : crystalShatterDustImage,
      rotation: (Math.random() - 0.5) * 180,
      delay: Math.random() * 0.1,
    }
  })

  return (
    <>
      {particles.map((p) => (
        <m.img
          key={p.id}
          src={p.src}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__tear-debris"
          style={{ '--debris-size': `${p.size}px` } as CSSProperties}
          initial={{ x: p.x, y: 0, opacity: 1, scale: 1, rotate: 0 }}
          animate={{
            x: p.endX,
            y: p.endY,
            opacity: [1, 0.8, 0],
            scale: [1, 0.6, 0.1],
            rotate: p.rotation,
          }}
          transition={{
            duration: 0.5,
            delay: p.delay,
            times: [0, 0.4, 1] as const,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

/**
 *
 */
export function PackTearOpen({ packImage }: { packImage: string }) {
  return (
    <div className="pf-card-pack__tear-container">
      {/* Flap — blasts upward, tumbles, shrinks into distance */}
      <m.img
        src={packImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__tear-flap"
        style={{ clipPath: TEAR_FLAP_CLIP }}
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
        animate={{
          x: [0, 15, 40],
          y: [0, -100, -200],
          rotate: [0, -15, -45],
          opacity: [1, 0.85, 0],
          scale: [1, 0.7, 0.3],
        }}
        transition={{
          duration: 0.75,
          times: [0, 0.4, 1] as const,
          ease: [0.2, 0, 0.6, 1] as const,
        }}
      />
      {/* Debris — sparkles + dust scatter from tear line */}
      <TearDebris />
      {/* Body — briefly shudders then drops */}
      <m.img
        src={packImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__tear-body"
        style={{ clipPath: TEAR_BODY_CLIP }}
        initial={{ y: 0, rotateZ: 0, opacity: 1, scale: 1 }}
        animate={{ y: 80, rotateZ: 3, opacity: [1, 0.8, 0], scale: [1, 0.95, 0.8] }}
        transition={{
          duration: 0.65,
          delay: 0.08,
          times: [0, 0.35, 1] as const,
          ease: [0.3, 0, 1, 1] as const,
        }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   TEAR-LINE FLASH — horizontal burst at the rip point
   Concentrated at the seam, not a full circular flash
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function TearLineFlash() {
  return (
    <m.div
      className="pf-card-pack__tear-flash"
      initial={{ scaleX: 0.2, scaleY: 1, opacity: 1 }}
      animate={{ scaleX: [0.2, 1.3, 1.6], scaleY: [1, 1.5, 0.3], opacity: [1, 0.85, 0] }}
      transition={{ duration: 0.35, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   LIGHT SPILL — upward fan of light from the tear
   Light pours out of the opened top like treasure glow
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function LightSpill() {
  return (
    <m.div
      className="pf-card-pack__light-spill"
      initial={{ scaleY: 0, opacity: 0.9 }}
      animate={{ scaleY: [0, 1, 1], opacity: [0.9, 0.5, 0] }}
      transition={{ duration: 0.55, delay: 0.04, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   GOLDEN CONFETTI — celebratory particles
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function GoldenConfetti({ confetti }: { confetti: ConfettiData[] }) {
  return (
    <div className="pf-card-pack__confetti-container">
      {confetti.map((c) => {
        const endX = Math.cos(c.angle) * c.distance
        const endY = Math.sin(c.angle) * c.distance + 25
        return (
          <m.img
            key={c.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className="pf-card-pack__confetti-piece"
            style={{ '--confetti-size': `${c.size}px` } as CSSProperties}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              x: endX,
              y: endY,
              opacity: [1, 0.7, 0],
              scale: [1, 0.5, 0.15],
              rotate: c.rotation,
            }}
            transition={{
              duration: 0.55 + Math.random() * 0.25,
              delay: Math.random() * 0.12,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

export { CardLandShimmer, FlipCard } from './FlipCardComponents'

/* ═══════════════════════════════════════════════════
   RARITY BURST — multi-layered: glow + sparkle flash + ring + particles
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function RarityBurst({ rarity, position }: { rarity: CardRarity; position: FanPosition }) {
  const burstScale = 0.5 + rarity * 0.45
  const particleCount = 3 + rarity * 3
  const color = RARITY_COLORS[rarity]

  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
    const dist = 20 + rarity * 12 + Math.random() * 10
    return { id: i, angle, dist, size: 4 + Math.random() * 6 }
  })

  return (
    <div
      className="pf-card-pack__rarity-burst-wrap"
      style={{ '--burst-x': `${position.x}px`, '--burst-y': `${position.y}px` } as CSSProperties}
    >
      <m.div
        className="pf-card-pack__rarity-glow"
        style={{ '--burst-color': color.glow } as CSSProperties}
        initial={{ scale: 0.3, opacity: 0.8 }}
        animate={{ scale: [0.3, burstScale * 1.5, burstScale * 2], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 0.55, times: [0, 0.4, 1] as const, ease: 'easeOut' }}
      />

      <m.img
        src={crystalShatterSparkleImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__rarity-flash"
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: [0, burstScale, burstScale * 1.3], opacity: [0.9, 0.4, 0] }}
        transition={{ duration: 0.35, times: [0, 0.35, 1] as const, ease: 'easeOut' }}
      />

      {rarity >= 3 && (
        <m.img
          src={crystalShatterPrismaticRingImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__rarity-ring"
          initial={{ scale: 0.05, opacity: 0.7 }}
          animate={{ scale: burstScale * 1.2, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      {particles.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__rarity-spark"
          style={{ '--spark-size': `${p.size}px` } as CSSProperties}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: 0.2,
          }}
          transition={{ duration: 0.45, delay: 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   SCREEN FLASH — epic / legendary
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function ScreenFlash({ rarity }: { rarity: CardRarity }) {
  if (rarity < 4) return null
  return (
    <m.div
      className={`pf-card-pack__screen-flash pf-card-pack__screen-flash--rarity-${rarity}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, rarity === 5 ? 0.4 : 0.22, 0] }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   COLLECT
   ═══════════════════════════════════════════════════ */

/**
 *
 */
export function CollectButton({ onCollect }: { onCollect: () => void }) {
  return (
    <m.button
      type="button"
      className="pf-card-pack__collect-btn"
      initial={{ opacity: 0, scale: 0.7, y: 15 }}
      animate={{ opacity: 1, scale: [0.7, 1.06, 1], y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -10, transition: { duration: 0.25, ease: 'easeIn' } }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }}
      onClick={onCollect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      COLLECT ALL
    </m.button>
  )
}

/**
 *
 */
export function CollectBurst() {
  return (
    <m.div
      className="pf-card-pack__collect-burst"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.3, 2, 2.8] }}
      transition={{ duration: 0.5, times: [0, 0.2, 1] as const, ease: 'easeOut' }}
    />
  )
}
