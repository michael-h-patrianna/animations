import { type CSSProperties } from 'react'

import { crystalShatterDustImage, crystalShatterSparkleImage } from '@/assets'

import type { ConfettiData } from '../CardPackParts'

/* ─── Tear edge — jagged rip shared between flap and body ─── */

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

export const TEAR_FLAP_CLIP = `polygon(0% 0%, 100% 0%, ${[...TEAR_EDGE]
  .reverse()
  .map(([x, y]) => `${x}% ${y}%`)
  .join(', ')})`
export const TEAR_BODY_CLIP = `polygon(${TEAR_EDGE.map(([x, y]) => `${x}% ${y}%`).join(', ')}, 100% 100%, 0% 100%)`

/* ─── Particle data types ─── */

/** Data for a single arrival dust particle. */
export type ArrivalDustData = {
  id: number
  endX: number
  endY: number
  size: number
  delay: number
}
/** Data for a single edge spark particle. */
export type EdgeSparkData = {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  size: number
  delay: number
}
/** Data for a single tear debris particle. */
export type TearDebrisData = {
  id: number
  startX: number
  endX: number
  endY: number
  size: number
  src: string
  rotation: number
  delay: number
}

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS — all CSS keyframe driven
   ═══════════════════════════════════════════════════ */

/** Dust particles that scatter on pack arrival. */
export function ArrivalDust({ particles }: { particles: ArrivalDustData[] }) {
  return (
    <div className="pf-card-pack-css__arrival-dust-container">
      {particles.map((p) => (
        <img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack-css__arrival-dust"
          style={
            {
              '--dust-size': `${p.size}px`,
              '--dust-end-x': `${p.endX}px`,
              '--dust-end-y': `${p.endY}px`,
              '--dust-delay': `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Glowing seam line during anticipation phase. */
export function SeamLight() {
  return <div className="pf-card-pack-css__seam" />
}

/** Sparkle particles along the pack edges during anticipation. */
export function EdgeSparks({ sparks }: { sparks: EdgeSparkData[] }) {
  return (
    <div className="pf-card-pack-css__edge-spark-container">
      {sparks.map((s) => (
        <img
          key={s.id}
          src={crystalShatterSparkleImage}
          alt=""
          aria-hidden="true"
          className="pf-card-pack-css__edge-spark"
          style={
            {
              '--spark-size': `${s.size}px`,
              '--spark-start-x': `${s.startX}px`,
              '--spark-start-y': `${s.startY}px`,
              '--spark-end-x': `${s.endX}px`,
              '--spark-end-y': `${s.endY}px`,
              '--spark-delay': `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Crack lines radiating from the pack seam during anticipation. */
export function SeamCracks() {
  const cracks = [
    { id: 0, x: '30%', rotate: -25, len: 16, delay: 0.3 },
    { id: 1, x: '65%', rotate: 18, len: 22, delay: 0.55 },
    { id: 2, x: '45%', rotate: -40, len: 18, delay: 0.8 },
  ]
  return (
    <div className="pf-card-pack-css__seam-crack-container">
      {cracks.map((c) => (
        <div
          key={c.id}
          className="pf-card-pack-css__seam-crack"
          style={
            {
              insetInlineStart: c.x,
              '--crack-rotate': `${c.rotate}deg`,
              '--crack-len': `${c.len}px`,
              '--crack-delay': `${c.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Pack tearing open — flap flies up, body drops, debris scatters. */
export function PackTearOpen({
  packImage,
  debris,
}: {
  packImage: string
  debris: TearDebrisData[]
}) {
  return (
    <div className="pf-card-pack-css__tear-container">
      <img
        src={packImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack-css__tear-flap"
        style={{ clipPath: TEAR_FLAP_CLIP }}
      />
      {debris.map((p) => (
        <img
          key={p.id}
          src={p.src}
          alt=""
          aria-hidden="true"
          className="pf-card-pack-css__tear-debris"
          style={
            {
              '--debris-size': `${p.size}px`,
              '--debris-start-x': `${p.startX}px`,
              '--debris-end-x': `${p.endX}px`,
              '--debris-end-y': `${p.endY}px`,
              '--debris-rotation': `${p.rotation}deg`,
              '--debris-delay': `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
      <img
        src={packImage}
        alt=""
        aria-hidden="true"
        className="pf-card-pack-css__tear-body"
        style={{ clipPath: TEAR_BODY_CLIP }}
      />
    </div>
  )
}

/** Horizontal flash along the tear line during burst. */
export function TearLineFlash() {
  return <div className="pf-card-pack-css__tear-flash" />
}

/** Light spill effect radiating from the opened pack. */
export function LightSpill() {
  return <div className="pf-card-pack-css__light-spill" />
}

/** Golden confetti particles during the fan phase. */
export function GoldenConfetti({ confetti }: { confetti: ConfettiData[] }) {
  return (
    <div className="pf-card-pack-css__confetti-container">
      {confetti.map((c) => {
        const endX = Math.cos(c.angle) * c.distance
        const endY = Math.sin(c.angle) * c.distance + 25
        return (
          <img
            key={c.id}
            src={crystalShatterDustImage}
            alt=""
            aria-hidden="true"
            className="pf-card-pack-css__confetti-piece"
            style={
              {
                '--confetti-size': `${c.size}px`,
                '--confetti-end-x': `${endX}px`,
                '--confetti-end-y': `${endY}px`,
                '--confetti-rotation': `${c.rotation}deg`,
                '--confetti-dur': `${c.duration}s`,
                '--confetti-delay': `${c.delay}s`,
              } as CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
