/**
 * Card-pack burst, reveal, and celebration phase effects.
 *
 * PackTearOpen — flap rips upward with jagged edge, body drops.
 * TearLineFlash — horizontal burst at the rip point.
 * LightSpill — upward fan of light from the opened top.
 * GoldenConfetti — celebratory particles.
 * RarityBurst — multi-layered glow + flash + ring per rarity.
 * ScreenFlash — epic/legendary full-screen flash.
 * CollectBurst — collect confirmation pulse.
 */

import * as m from 'motion/react-m'
import { useMemo, type CSSProperties } from 'react'

import crystalShatterDustImage from '@/assets/crystal-shatter/crystal-dust.webp'
import crystalShatterPrismaticRingImage from '@/assets/crystal-shatter/prismatic-ring.webp'
import crystalShatterSparkleImage from '@/assets/crystal-shatter/crystal-sparkle.webp'

import type { CardRarity, ConfettiData, FanPosition } from './SharedCardPackTypes'
import { RARITY_COLORS } from './SharedCardPackTypes'
import styles from './framer/PrizeRevealCardPackOpen.module.css'

/* ═══════════════════════════════════════════════════
   PACK TEAR OPEN — top-rip with jagged tear line
   Flap tears upward, body drops — the hero moment
   ═══════════════════════════════════════════════════ */

/* Tear edge — irregular rip with varied amplitude, spacing, and wandering baseline.
   Points shared between flap (above) and body (below) so they mesh seamlessly. */
const TEAR_EDGE = [
  [0, 30],
  [5, 24],
  [10, 31],
  [16, 22],
  [22, 29],
  [28, 34],
  [35, 23],
  [42, 30],
  [48, 21],
  [55, 32],
  [62, 25],
  [68, 34],
  [75, 22],
  [82, 31],
  [88, 24],
  [94, 33],
  [100, 27],
] as const

const TEAR_FLAP_CLIP = `polygon(0% 0%, 100% 0%, ${[...TEAR_EDGE]
  .reverse()
  .map(([x, y]) => `${x}% ${y}%`)
  .join(', ')})`
const TEAR_BODY_CLIP = `polygon(${TEAR_EDGE.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 0% 100%)`

const TEAR_DEBRIS_COUNT = 7

const TEAR_DEBRIS = Array.from({ length: TEAR_DEBRIS_COUNT }, (_, i) => {
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

function TearDebris() {
  return (
    <>
      {TEAR_DEBRIS.map((p) => (
        <m.img
          key={p.id}
          src={p.src}
          alt=""
          aria-hidden="true"
          className={styles['pf-card-pack-fm__tear-debris']}
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

export function PackTearOpen({ packImage }: { packImage: string }) {
  return (
    <div className={styles['pf-card-pack-fm__tear-container']}>
      {/* Flap — blasts upward, tumbles, shrinks into distance */}
      <m.img
        src={packImage}
        alt=""
        aria-hidden="true"
        className={styles['pf-card-pack-fm__tear-flap']}
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
        className={styles['pf-card-pack-fm__tear-body']}
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

export function TearLineFlash() {
  return (
    <m.div
      className={styles['pf-card-pack-fm__tear-flash']}
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

export function LightSpill() {
  return (
    <m.div
      className={styles['pf-card-pack-fm__light-spill']}
      initial={{ scaleY: 0, opacity: 0.9 }}
      animate={{ scaleY: [0, 1, 1], opacity: [0.9, 0.5, 0] }}
      transition={{ duration: 0.55, delay: 0.04, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   GOLDEN CONFETTI — celebratory particles
   ═══════════════════════════════════════════════════ */

export function GoldenConfetti({ confetti }: { confetti: ConfettiData[] }) {
  return (
    <div className={styles['pf-card-pack-fm__confetti-container']}>
      {confetti.map((c) => {
        const endX = Math.cos(c.angle) * c.distance
        const endY = Math.sin(c.angle) * c.distance + 25
        return (
          <m.img
            key={c.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className={styles['pf-card-pack-fm__confetti-piece']}
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
              duration: c.duration,
              delay: c.delay,
              ease: 'easeOut',
            }}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   RARITY BURST — multi-layered: glow + sparkle flash + ring + particles
   ═══════════════════════════════════════════════════ */

export function RarityBurst({ rarity, position }: { rarity: CardRarity; position: FanPosition }) {
  const burstScale = 0.5 + rarity * 0.45
  const particleCount = 3 + rarity * 3
  const color = RARITY_COLORS[rarity]

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        const dist = 20 + rarity * 12 + Math.random() * 10
        return { id: i, angle, dist, size: 4 + Math.random() * 6 }
      }),
    [particleCount, rarity]
  )

  return (
    <div
      className={styles['pf-card-pack-fm__rarity-burst-wrap']}
      style={{ '--burst-x': `${position.x}px`, '--burst-y': `${position.y}px` } as CSSProperties}
    >
      <m.div
        className={styles['pf-card-pack-fm__rarity-glow']}
        style={{ '--burst-color': color.glow } as CSSProperties}
        initial={{ scale: 0.3, opacity: 0.8 }}
        animate={{ scale: [0.3, burstScale * 1.5, burstScale * 2], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 0.55, times: [0, 0.4, 1] as const, ease: 'easeOut' }}
      />

      <m.img
        src={crystalShatterSparkleImage}
        alt=""
        aria-hidden="true"
        className={styles['pf-card-pack-fm__rarity-flash']}
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: [0, burstScale, burstScale * 1.3], opacity: [0.9, 0.4, 0] }}
        transition={{ duration: 0.35, times: [0, 0.35, 1] as const, ease: 'easeOut' }}
      />

      {rarity >= 3 && (
        <m.img
          src={crystalShatterPrismaticRingImage}
          alt=""
          aria-hidden="true"
          className={styles['pf-card-pack-fm__rarity-ring']}
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
          className={styles['pf-card-pack-fm__rarity-spark']}
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

export function ScreenFlash({ rarity }: { rarity: CardRarity }) {
  if (rarity < 4) return null
  return (
    <m.div
      className={`${styles['pf-card-pack-fm__screen-flash']} ${styles[`pf-card-pack-fm__screen-flash--rarity-${rarity}`]}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, rarity === 5 ? 0.4 : 0.22, 0] }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    />
  )
}

export function CollectBurst() {
  return (
    <m.div
      className={styles['pf-card-pack-fm__collect-burst']}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.6, 0], scale: [0.3, 2, 2.8] }}
      transition={{ duration: 0.5, times: [0, 0.2, 1] as const, ease: 'easeOut' }}
    />
  )
}
