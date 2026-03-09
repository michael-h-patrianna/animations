import * as m from 'motion/react-m'
import { useState, type CSSProperties } from 'react'

import {
  cardPackBackImage,
  crystalShatterDustImage,
  crystalShatterEnergyMoteImage,
  crystalShatterPrismaticRingImage,
  crystalShatterSparkleImage,
} from '@/assets'

/* ─── Shared types ─── */

export type PackPhase = 'arrival' | 'anticipation' | 'burst' | 'fan' | 'flip' | 'idle'

export type CardRarity = 1 | 2 | 3 | 4 | 5

export type CardData = {
  id: number
  name: string
  rarity: CardRarity
  frontImage: string
  isNew?: boolean
}

export type FanPosition = { x: number; y: number; rotate: number }

export type ConvergeMoteData = {
  id: number
  startX: number
  startY: number
  midX: number
  midY: number
  size: number
  delay: number
}

export type ConfettiData = {
  id: number
  angle: number
  distance: number
  rotation: number
  size: number
}

/* ─── Constants ─── */

export const RARITY_COLORS: Record<CardRarity, { primary: string; glow: string }> = {
  1: { primary: 'rgb(180 195 210)', glow: 'rgb(180 195 210 / 40%)' },
  2: { primary: 'rgb(80 200 120)', glow: 'rgb(80 200 120 / 40%)' },
  3: { primary: 'rgb(160 90 255)', glow: 'rgb(160 90 255 / 40%)' },
  4: { primary: 'rgb(255 185 40)', glow: 'rgb(255 185 40 / 40%)' },
  5: { primary: 'rgb(255 100 180)', glow: 'rgb(255 100 180 / 40%)' },
}

export const FAN_POSITIONS: FanPosition[] = [
  { x: -116, y: 20, rotate: -12 },
  { x: -58, y: 6, rotate: -6 },
  { x: 0, y: -8, rotate: 0 },
  { x: 58, y: 6, rotate: 6 },
  { x: 116, y: 20, rotate: 12 },
]

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
   ATMOSPHERE — floating dust particles (image-based)
   ═══════════════════════════════════════════════════ */

export function AmbientMotes() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 340,
    y: (Math.random() - 0.5) * 300,
    size: 3 + Math.random() * 4,
    duration: 5 + Math.random() * 5,
    delay: Math.random() * 3,
  }))

  return (
    <div className="pf-card-pack__ambient">
      {particles.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__ambient-mote"
          style={{ '--mote-size': `${p.size}px` } as CSSProperties}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.45, 0.25, 0.45, 0],
            x: [p.x, p.x + 14, p.x - 10, p.x + 8, p.x],
            y: [p.y, p.y - 10, p.y + 8, p.y - 5, p.y],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   PACK BODY — holographic shimmer + multi-layer glow
   ═══════════════════════════════════════════════════ */

/** Escalating shake — amplitude ramps from gentle tremor to violent judder */
const SHAKE_STEPS = 30
const SHAKE_KEYFRAMES = (() => {
  const x: number[] = []
  const y: number[] = []
  const rot: number[] = []
  for (let i = 0; i <= SHAKE_STEPS; i++) {
    const t = i / SHAKE_STEPS
    const amp = 1 + t * 5 // 1px → 6px
    const rotAmp = 0.3 + t * 1.7 // 0.3° → 2°
    const sign = i % 2 === 0 ? 1 : -1
    const jitter = 0.6 + Math.random() * 0.4
    x.push(sign * amp * jitter * (0.8 + Math.random() * 0.4))
    y.push(-sign * amp * jitter * 0.5)
    rot.push(sign * rotAmp * jitter)
  }
  // End at rest
  x[SHAKE_STEPS] = 0
  y[SHAKE_STEPS] = 0
  rot[SHAKE_STEPS] = 0
  return { x, y, rot }
})()

export function PackBody({ phase, packImage }: { phase: PackPhase; packImage: string }) {
  const isShaking = phase === 'anticipation'
  const isVisible = phase === 'arrival' || phase === 'anticipation'

  if (!isVisible) return null

  return (
    <m.div
      className="pf-card-pack__pack-body"
      initial={{ y: -180, scale: 0.5, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        y: { duration: 0.8, ease: [0.16, 0.84, 0.32, 1] },
        scale: { duration: 0.8, ease: [0.16, 0.84, 0.32, 1] },
        opacity: { duration: 0.4 },
      }}
    >
      <m.div
        animate={
          isShaking
            ? { x: SHAKE_KEYFRAMES.x, y: SHAKE_KEYFRAMES.y, rotate: SHAKE_KEYFRAMES.rot }
            : {}
        }
        transition={isShaking ? { duration: 1.0, ease: 'linear' } : {}}
      >
        <img src={packImage} alt="" aria-hidden="true" className="pf-card-pack__pack-image" />
        <m.div
          className="pf-card-pack__pack-glow"
          animate={
            isShaking
              ? { opacity: [0.3, 0.5, 0.7, 0.9], scale: [1, 1.1, 1.15, 1.3] }
              : { opacity: [0.2, 0.35, 0.2], scale: 1 }
          }
          transition={{
            duration: isShaking ? 1.0 : 2.5,
            repeat: isShaking ? 0 : Infinity,
            ease: 'easeIn',
          }}
        />
        <m.div
          className="pf-card-pack__pack-ambient-glow"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            isShaking
              ? { opacity: [0.6, 0.8], scale: [1, 1.3] }
              : { opacity: 0.6, scale: 1 }
          }
          transition={{ duration: isShaking ? 1.0 : 0.8, ease: 'easeOut' }}
        />
      </m.div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   LANDING PULSE
   ═══════════════════════════════════════════════════ */

export function LandingPulse() {
  return (
    <m.div
      className="pf-card-pack__landing-pulse"
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0.3, 1.6, 2.1] }}
      transition={{ duration: 0.5, delay: 0.75, times: [0, 0.35, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   SEAM LIGHT — horizontal glow at pack's tear line
   ═══════════════════════════════════════════════════ */

export function SeamLight({ phase }: { phase: PackPhase }) {
  if (phase !== 'anticipation') return null

  return (
    <m.div
      className="pf-card-pack__seam"
      initial={{ opacity: 0, scaleX: 0.2 }}
      animate={{ opacity: [0, 0.5, 1], scaleX: [0.2, 0.6, 1.2] }}
      transition={{ duration: 1.2, times: [0, 0.5, 1] as const, ease: 'easeIn' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   ARRIVAL DUST — impact particles when the pack lands
   ═══════════════════════════════════════════════════ */

const ARRIVAL_DUST_COUNT = 8

export function ArrivalDust() {
  const particles = Array.from({ length: ARRIVAL_DUST_COUNT }, (_, i) => {
    // Semicircle below the pack — angles from ~150° to ~390° (downward fan)
    const angle = (150 + (i / (ARRIVAL_DUST_COUNT - 1)) * 240) * (Math.PI / 180)
    const dist = 30 + Math.random() * 40
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
          initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
          animate={{
            x: p.endX,
            y: p.endY,
            opacity: [0.8, 0.5, 0],
            scale: [1, 0.5, 0.1],
          }}
          transition={{
            duration: 0.4,
            delay: 0.72 + Math.random() * 0.06,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   ENERGY RINGS — concentric pulses during anticipation
   Each ring gets brighter/larger to show escalation
   ═══════════════════════════════════════════════════ */

export function EnergyRings() {
  const rings = [
    { id: 0, delay: 0.1, endScale: 1.6, opacity: 0.4 },
    { id: 1, delay: 0.35, endScale: 2.0, opacity: 0.55 },
    { id: 2, delay: 0.65, endScale: 2.5, opacity: 0.7 },
  ]

  return (
    <div className="pf-card-pack__energy-ring-container">
      {rings.map((ring) => (
        <m.div
          key={ring.id}
          className="pf-card-pack__energy-ring"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [0.3, ring.endScale], opacity: [ring.opacity, 0] }}
          transition={{ duration: 0.5, delay: ring.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   EDGE SPARKS — sparkles from pack edges during anticipation
   Frequency increases toward the end for escalation
   ═══════════════════════════════════════════════════ */

export function EdgeSparks() {
  const sparks = Array.from({ length: 8 }, (_, i) => {
    // Distribute around pack edges — top, sides, corners
    const side = i % 4
    const packW = 72 // half pack width
    const packH = 109 // half pack height
    let startX: number, startY: number, endX: number, endY: number
    switch (side) {
      case 0: // top edge
        startX = (Math.random() - 0.5) * packW * 2
        startY = -packH
        endX = startX + (Math.random() - 0.5) * 30
        endY = startY - 15 - Math.random() * 25
        break
      case 1: // right edge
        startX = packW
        startY = (Math.random() - 0.5) * packH
        endX = startX + 15 + Math.random() * 20
        endY = startY + (Math.random() - 0.5) * 20
        break
      case 2: // bottom edge
        startX = (Math.random() - 0.5) * packW * 2
        startY = packH * 0.6
        endX = startX + (Math.random() - 0.5) * 30
        endY = startY + 10 + Math.random() * 20
        break
      default: // left edge
        startX = -packW
        startY = (Math.random() - 0.5) * packH
        endX = startX - 15 - Math.random() * 20
        endY = startY + (Math.random() - 0.5) * 20
    }
    // Stagger: early sparks are spaced out, last 3 fire rapidly near the end
    const delay = i < 5 ? i * 0.15 : 0.6 + (i - 5) * 0.08
    return { id: i, startX, startY, endX, endY, size: 6 + Math.random() * 6, delay }
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
   SEAM CRACKS — branching fracture lines from the seam
   Appear progressively to show the pack rupturing
   ═══════════════════════════════════════════════════ */

export function SeamCracks() {
  const cracks = [
    { id: 0, x: '30%', rotate: -25, len: 16, delay: 0.35 },
    { id: 1, x: '65%', rotate: 18, len: 22, delay: 0.6 },
    { id: 2, x: '48%', rotate: -40, len: 18, delay: 0.8 },
    { id: 3, x: '20%', rotate: 32, len: 14, delay: 0.9 },
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
   RADIAL RAYS — light beams radiating outward on burst
   ═══════════════════════════════════════════════════ */

const RADIAL_RAY_COUNT = 10

export function RadialRays() {
  const rays = Array.from({ length: RADIAL_RAY_COUNT }, (_, i) => {
    const angle = (i / RADIAL_RAY_COUNT) * 360
    const len = 80 + Math.random() * 50
    return { id: i, angle, len, delay: i * 0.015 }
  })

  return (
    <div className="pf-card-pack__radial-rays-container">
      {rays.map((ray) => (
        <m.div
          key={ray.id}
          className="pf-card-pack__radial-ray"
          style={{
            rotate: `${ray.angle}deg`,
            '--ray-len': `${ray.len}px`,
          } as CSSProperties}
          initial={{ scaleY: 0, opacity: 0.9 }}
          animate={{ scaleY: [0, 1, 1], opacity: [0.9, 0.5, 0] }}
          transition={{
            duration: 0.4,
            delay: ray.delay,
            times: [0, 0.35, 1] as const,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   CONVERGE MOTES — energy particles spiraling inward (image-based)
   ═══════════════════════════════════════════════════ */

export function ConvergeMotes({ motes }: { motes: ConvergeMoteData[] }) {
  return (
    <div className="pf-card-pack__converge-container">
      {motes.map((mote) => (
        <m.img
          key={mote.id}
          src={crystalShatterEnergyMoteImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack__converge-mote"
          style={{ '--mote-size': `${mote.size}px` } as CSSProperties}
          initial={{ x: mote.startX, y: mote.startY, scale: 1, opacity: 0 }}
          animate={{
            x: [mote.startX, mote.midX, 0],
            y: [mote.startY, mote.midY, 0],
            scale: [1, 0.7, 0.15],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 0.75,
            delay: mote.delay,
            times: [0, 0.5, 1] as const,
            ease: [0.4, 0, 0.2, 1] as const,
          }}
        />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   PACK BURST — top-rip open with jagged tear line
   Flap tears upward, body stays then fades
   ═══════════════════════════════════════════════════ */

const TEAR_DEBRIS_COUNT = 10

function TearDebris() {
  const particles = Array.from({ length: TEAR_DEBRIS_COUNT }, (_, i) => {
    const spread = (i / (TEAR_DEBRIS_COUNT - 1)) * 160 - 80
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

export function BurstFlash() {
  return (
    <m.img
      src={crystalShatterSparkleImage}
      alt=""
      aria-hidden="true"
      className="pf-card-pack__burst-flash"
      initial={{ scale: 0, opacity: 0.9 }}
      animate={{ scale: [0, 2.5, 3.5], opacity: [0.9, 0.5, 0] }}
      transition={{ duration: 0.35, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

export function BurstRing() {
  return (
    <m.img
      src={crystalShatterPrismaticRingImage}
      alt=""
      aria-hidden="true"
      className="pf-card-pack__burst-ring"
      initial={{ scale: 0.1, opacity: 0.75 }}
      animate={{ scale: [0.1, 2.8], opacity: [0.75, 0] }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    />
  )
}

export function LightColumn() {
  return (
    <m.div
      className="pf-card-pack__light-column"
      initial={{ scaleY: 0, opacity: 0.85 }}
      animate={{ scaleY: [0, 1, 1], opacity: [0.85, 0.55, 0] }}
      transition={{ duration: 0.7, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

export function ShockwaveRing() {
  return (
    <m.div
      className="pf-card-pack__shockwave"
      initial={{ scale: 0.3, opacity: 0.8 }}
      animate={{ scale: 4.5, opacity: 0 }}
      transition={{ duration: 0.55, delay: 0.04, ease: [0.16, 0.84, 0.32, 1] as const }}
    />
  )
}

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

/* ═══════════════════════════════════════════════════
   CARD NAME RIBBON — SVG text auto-scales to fit, wraps to 2 lines
   ═══════════════════════════════════════════════════ */

function CardNameRibbon({ name, rarity }: { name: string; rarity: CardRarity }) {
  const words = name.split(' ')
  const multiLine = name.length > 11 && words.length >= 2
  const line1 = multiLine ? words.slice(0, Math.ceil(words.length / 2)).join(' ') : name
  const line2 = multiLine ? words.slice(Math.ceil(words.length / 2)).join(' ') : ''
  const svgH = multiLine ? 32 : 22

  return (
    <div className={`pf-card-pack__card-ribbon pf-card-pack__card-ribbon--rarity-${rarity}`}>
      <svg
        viewBox={`0 0 100 ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
        className="pf-card-pack__card-ribbon-svg"
        role="img"
        aria-label={name}
      >
        {multiLine ? (
          <>
            <text
              x="50"
              y={svgH * 0.36}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontWeight="900"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {line1}
            </text>
            <text
              x="50"
              y={svgH * 0.76}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontWeight="900"
              fontSize="10"
              fontFamily="system-ui, sans-serif"
            >
              {line2}
            </text>
          </>
        ) : (
          <text
            x="50"
            y={svgH / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontWeight="900"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
          >
            {name}
          </text>
        )}
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   NEW BADGE — red starburst with white "NEW" text
   Pops in after the card flips with a bouncy scale
   ═══════════════════════════════════════════════════ */

/** 12-point starburst clip-path for the badge shape */
const STARBURST_POINTS = 12
const STARBURST_CLIP = (() => {
  const pts: string[] = []
  for (let i = 0; i < STARBURST_POINTS * 2; i++) {
    const angle = (i / (STARBURST_POINTS * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? 50 : 38
    const x = 50 + r * Math.cos(angle)
    const y = 50 + r * Math.sin(angle)
    pts.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`)
  }
  return `polygon(${pts.join(', ')})`
})()

function NewBadge() {
  return (
    <m.div
      className="pf-card-pack__new-badge"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="pf-card-pack__new-badge-star" style={{ clipPath: STARBURST_CLIP }}>
        <span className="pf-card-pack__new-badge-text">NEW</span>
      </div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   CARD LAND SHIMMER — subtle glow pulse when a card
   arrives at its fan position (secondary action)
   ═══════════════════════════════════════════════════ */

export function CardLandShimmer({ position, delay }: { position: FanPosition; delay: number }) {
  return (
    <m.div
      className="pf-card-pack__land-shimmer"
      style={{ '--shimmer-x': `${position.x}px`, '--shimmer-y': `${position.y}px` } as CSSProperties}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0.55, 0], scale: [0.2, 1.1, 1.5] }}
      transition={{ duration: 0.55, delay, times: [0, 0.3, 1] as const, ease: 'easeOut' }}
    />
  )
}

/* ═══════════════════════════════════════════════════
   IDLE FLOAT — sinusoidal wave with subtle rotation sway
   Main: vertical sine (7px, 3.5s)
   Subtle: rotation sine (±1.5°, same period, π/4 phase lead)
   ═══════════════════════════════════════════════════ */

const FLOAT_STEPS = 24
const FLOAT_Y_AMP = 4
const FLOAT_ROT_AMP = 0.8
const FLOAT_DURATION = 3.5

function generateFloatKeyframes() {
  const yKeys: number[] = []
  const rotKeys: number[] = []
  for (let k = 0; k <= FLOAT_STEPS; k++) {
    const t = k / FLOAT_STEPS
    yKeys.push(FLOAT_Y_AMP * Math.sin(t * Math.PI * 2))
    rotKeys.push(FLOAT_ROT_AMP * Math.sin(t * Math.PI * 2))
  }
  // Both start and end at 0 — seamless loop, no jump from rest position
  return { yKeys, rotKeys }
}

// Single shared instance — all cards use the same waveform, staggered by delay
const FLOAT_KEYFRAMES = generateFloatKeyframes()

/* ═══════════════════════════════════════════════════
   FLIP CARD — Monopoly Go style: frame + lights + 3D stars + ribbon
   ═══════════════════════════════════════════════════ */

export function FlipCard({
  card,
  position,
  flipped,
  fanDelay,
  collected,
  collectIndex,
  idle = false,
  bobPhase = 0,
  selected = false,
  anySelected = false,
  onSelect,
}: {
  card: CardData
  position: FanPosition
  flipped: boolean
  fanDelay: number
  collected: boolean
  collectIndex: number
  idle?: boolean
  bobPhase?: number
  selected?: boolean
  anySelected?: boolean
  onSelect?: () => void
}) {
  const rarityClass = `pf-card-pack__card--rarity-${card.rarity}`

  // Track whether the initial fan-in animation has completed
  const [fanInDone, setFanInDone] = useState(false)

  const floatActive = idle && !collected
  // Stagger delay: converts bobPhase (radians) into a time offset within the cycle
  const floatDelay = (bobPhase / (Math.PI * 2)) * FLOAT_DURATION

  const canTap = idle && flipped && !collected && onSelect
  const inspecting = selected || anySelected

  // Spring config shared by all inspect transitions
  const inspectSpring = { type: 'spring' as const, stiffness: 260, damping: 26, mass: 1 }

  // Determine outer slot animation target
  const slotAnimate = collected
    ? {
        x: [position.x, position.x * 0.3],
        y: [position.y, -320],
        scale: [1, 0.15],
        opacity: [1, 0],
        rotate: [position.rotate, 0],
      }
    : selected
      ? { x: 0, y: -10, scale: 1.4, opacity: 1, rotate: 0 }
      : anySelected
        ? { x: position.x, y: position.y, scale: 0.88, opacity: 0.3, rotate: position.rotate }
        : fanInDone
          ? { x: position.x, y: position.y, scale: 1, opacity: 1, rotate: position.rotate }
          : { x: position.x, y: position.y, scale: [0, 1.12, 1], opacity: 1, rotate: position.rotate }

  // Determine outer slot transition
  const slotTransition = collected
    ? { duration: 0.65, delay: collectIndex * 0.08, ease: [0.4, 0, 1, 1] as const }
    : inspecting || fanInDone
      ? inspectSpring
      : { duration: 0.5, delay: fanDelay, ease: [0.34, 1.56, 0.64, 1] as const }

  return (
    <m.div
      className={`pf-card-pack__card-slot ${rarityClass}`}
      style={{
        zIndex: selected ? 20 : undefined,
        cursor: canTap && !anySelected ? 'pointer' : selected ? 'pointer' : undefined,
        pointerEvents: anySelected && !selected ? 'none' : undefined,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 }}
      animate={slotAnimate}
      transition={slotTransition}
      onClick={canTap ? onSelect : undefined}
      onAnimationComplete={() => { if (!fanInDone && !collected) setFanInDone(true) }}
    >
      {/* Float wrapper — keyframes start at y:0, staggered by delay per card */}
      <m.div
        className="pf-card-pack__card-perspective"
        animate={
          floatActive
            ? { y: FLOAT_KEYFRAMES.yKeys, rotate: FLOAT_KEYFRAMES.rotKeys }
            : {}
        }
        transition={
          floatActive
            ? { duration: FLOAT_DURATION, repeat: Infinity, ease: 'linear', delay: floatDelay }
            : undefined
        }
      >
        {/* Flipper — rotateY driven by Framer, preserve-3d inline */}
        <m.div
          className="pf-card-pack__card-flipper"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] as const }}
          style={{ transformStyle: 'preserve-3d' } as CSSProperties}
        >
          {/* ── BACK FACE ── */}
          <div className="pf-card-pack__card-face pf-card-pack__card-back">
            <div className="pf-card-pack__card-frame">
              <img
                src={cardPackBackImage}
                alt=""
                aria-hidden="true"
                className="pf-card-pack__card-img"
              />
            </div>
          </div>

          {/* ── FRONT FACE ── */}
          <div className="pf-card-pack__card-face pf-card-pack__card-front">
            {/* Gold 3D stars — overflow above the frame */}
            <m.div
              className={`pf-card-pack__card-stars pf-card-pack__card-stars--rarity-${card.rarity}`}
              {...(card.rarity === 5 ? {
                animate: {
                  filter: [
                    'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 8px rgba(255,80,180,0.5))',
                    'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 10px rgba(255,220,50,0.6))',
                    'drop-shadow(0 3px 4px rgba(0,0,0,0.55)) drop-shadow(0 0 8px rgba(255,80,180,0.5))',
                  ],
                },
                transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              } : {})}
            >
              {Array.from({ length: card.rarity }, (_, i) => {
                const mid = (card.rarity - 1) / 2
                const arcY = Math.abs(i - mid) * 2
                return (
                <svg
                  key={i}
                  className="pf-card-pack__card-star"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  style={{ transform: `translateY(${arcY}px)` }}
                >
                  <defs>
                    <radialGradient id={`pf-sg-${card.id}-${i}`} cx="38%" cy="28%" r="72%">
                      <stop offset="0%" stopColor="#FFFDE7" />
                      <stop offset="25%" stopColor="#FFE100" />
                      <stop offset="65%" stopColor="#FFA000" />
                      <stop offset="100%" stopColor="#E65100" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={`url(#pf-sg-${card.id}-${i})`}
                    stroke="#9A3412"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                </svg>
                )
              })}
            </m.div>

            {/* Card frame — white border + art */}
            <m.div
              className={`pf-card-pack__card-frame pf-card-pack__card-frame--rarity-${card.rarity}`}
              {...(card.rarity === 5 ? {
                animate: {
                  boxShadow: [
                    '0 4px 16px rgba(0,0,0,0.4), 0 0 22px 10px rgba(255,80,170,0.45), inset 0 0 0 2px rgba(255,80,170,0.5)',
                    '0 4px 20px rgba(0,0,0,0.4), 0 0 22px 10px rgba(100,160,255,0.45), inset 0 0 0 2px rgba(100,160,255,0.5)',
                    '0 4px 20px rgba(0,0,0,0.4), 0 0 22px 10px rgba(255,215,50,0.45), inset 0 0 0 2px rgba(255,215,50,0.5)',
                    '0 4px 16px rgba(0,0,0,0.4), 0 0 22px 10px rgba(255,80,170,0.45), inset 0 0 0 2px rgba(255,80,170,0.5)',
                  ],
                },
                transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              } : {})}
            >
              <div className="pf-card-pack__card-img-area">
                <img src={card.frontImage} alt={card.name} className="pf-card-pack__card-img" />
              </div>
            </m.div>

            {/* Name ribbon — overflow below the frame */}
            <CardNameRibbon name={card.name} rarity={card.rarity} />

            {/* NEW badge — right side above the ribbon */}
            {card.isNew && <NewBadge />}
          </div>
        </m.div>
      </m.div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   RARITY BURST — multi-layered: glow + sparkle flash + ring + particles
   ═══════════════════════════════════════════════════ */

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
      {/* Glow pulse */}
      <m.div
        className="pf-card-pack__rarity-glow"
        style={{ '--burst-color': color.glow } as CSSProperties}
        initial={{ scale: 0.3, opacity: 0.8 }}
        animate={{ scale: [0.3, burstScale * 1.5, burstScale * 2], opacity: [0.8, 0.3, 0] }}
        transition={{ duration: 0.55, times: [0, 0.4, 1] as const, ease: 'easeOut' }}
      />

      {/* Flash (sparkle image) */}
      <m.img
        src={crystalShatterSparkleImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack__rarity-flash"
        initial={{ scale: 0, opacity: 0.9 }}
        animate={{ scale: [0, burstScale, burstScale * 1.3], opacity: [0.9, 0.4, 0] }}
        transition={{ duration: 0.35, times: [0, 0.35, 1] as const, ease: 'easeOut' }}
      />

      {/* Ring burst for rare+ */}
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

      {/* Spark particles (dust images flying outward) */}
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
