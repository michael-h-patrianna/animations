import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'
import './ModalCelebrationsFireworksTriple.css'

/* ─── Types ─── */

type BurstConfig = {
  cx: number
  cy: number
  delay: number
  colors: readonly string[]
}

type Ray = {
  id: number
  angle: number
  length: number
  color: string
  cx: number
  cy: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

type Trail = {
  id: number
  shape: ConfettiShape
  color: string
  tx: number
  ty: number
  scale: number
  peakOp: number
  rotZ: number
  cx: number
  cy: number
  delay: number
  dur: number
  layer: 'bg' | 'fg'
}

type Sparkle = {
  id: number
  x: number
  y: number
  delay: number
  size: number
}

/* ─── Constants ─── */

const BURSTS: BurstConfig[] = [
  { cx: -35, cy: -18, delay: 0, colors: [CELEBRATION_COLORS[0], CELEBRATION_COLORS[3], CELEBRATION_COLORS[4]] },
  { cx: 32, cy: -28, delay: 0.3, colors: [CELEBRATION_COLORS[2], CELEBRATION_COLORS[4], CELEBRATION_COLORS[1]] },
  { cx: 4, cy: 8, delay: 0.55, colors: [CELEBRATION_COLORS[3], CELEBRATION_COLORS[0], CELEBRATION_COLORS[2]] },
]

const RAYS_PER_BURST = 14
const TRAILS_PER_BURST = 10
const SPARKLES_PER_BURST = 8

/* ─── Generators ─── */

function makeRays(): Ray[] {
  const rays: Ray[] = []
  let id = 0

  for (const burst of BURSTS) {
    for (let j = 0; j < RAYS_PER_BURST; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'
      rays.push({
        id: id++,
        angle: (j / RAYS_PER_BURST) * 360 + randBetween(-6, 6),
        length: isBg ? randBetween(35, 65) : randBetween(55, 110),
        color: burst.colors[j % burst.colors.length],
        cx: burst.cx,
        cy: burst.cy,
        delay: burst.delay * 1000 + randBetween(0, 60),
        dur: isBg ? randBetween(600, 900) : randBetween(500, 800),
        layer,
      })
    }
  }

  return rays
}

/**
 * Trail confetti — CSS variant uses pre-computed tx,ty endpoints.
 * CSS keyframe interpolates linearly from center to endpoint with gravity at the end.
 */
function makeTrails(): Trail[] {
  const trails: Trail[] = []
  let id = 0

  for (const burst of BURSTS) {
    for (let j = 0; j < TRAILS_PER_BURST; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      const angleDeg = (j / TRAILS_PER_BURST) * 360 + randBetween(-12, 12)
      const angleRad = deg2rad(angleDeg)
      const maxDist = isBg ? randBetween(40, 70) : randBetween(60, 115)

      trails.push({
        id: id++,
        shape: pickRandom(CONFETTI_SHAPES),
        color: burst.colors[j % burst.colors.length],
        tx: Math.sin(angleRad) * maxDist,
        ty: -Math.cos(angleRad) * maxDist,
        scale: isBg ? randBetween(0.5, 0.8) : randBetween(0.7, 1.1),
        peakOp: isBg ? 0.5 : 1,
        rotZ: randBetween(-180, 180),
        cx: burst.cx,
        cy: burst.cy,
        delay: burst.delay * 1000 + 40 + j * 15 + randBetween(0, 20),
        dur: isBg ? randBetween(1400, 1800) : randBetween(1100, 1500),
        layer,
      })
    }
  }

  return trails
}

function makeSparkles(): Sparkle[] {
  const sparkles: Sparkle[] = []
  let id = 0

  for (const burst of BURSTS) {
    for (let j = 0; j < SPARKLES_PER_BURST; j++) {
      const angleDeg = (j / SPARKLES_PER_BURST) * 360 + randBetween(-15, 15)
      const angleRad = deg2rad(angleDeg)
      const r = randBetween(65, 115)
      sparkles.push({
        id: id++,
        x: burst.cx + Math.sin(angleRad) * r,
        y: burst.cy + -Math.cos(angleRad) * r + randBetween(-3, 8),
        delay: burst.delay * 1000 + 200 + j * 60 + randBetween(0, 80),
        size: randBetween(2.5, 5),
      })
    }
  }

  return sparkles
}

/* ─── Sub-components ─── */

function RayLayer({ rays }: { rays: Ray[] }) {
  return (
    <>
      {rays.map((r) => (
        <span
          key={r.id}
          className="pf-celebration__ray"
          style={
            {
              left: `calc(50% + ${r.cx}px)`,
              top: `calc(50% + ${r.cy}px)`,
              height: `${r.length}px`,
              background: `linear-gradient(to top, transparent 0%, ${r.color} 35%, var(--pf-base-50) 94%)`,
              transformOrigin: '50% 100%',
              '--a': `${r.angle}deg`,
              animation: `ft-ray ${r.dur}ms ease-out ${r.delay}ms forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function TrailLayer({ trails }: { trails: Trail[] }) {
  return (
    <>
      {trails.map((t) => (
        <span
          key={t.id}
          className={`pf-celebration__confetti pf-celebration__confetti--${t.shape}`}
          style={
            {
              left: `calc(50% + ${t.cx}px)`,
              top: `calc(50% + ${t.cy}px)`,
              background: t.color,
              '--tx': `${t.tx}px`,
              '--ty': `${t.ty}px`,
              '--s': t.scale,
              '--peak-op': t.peakOp,
              '--rz': `${t.rotZ}deg`,
              animation: `ft-trail ${t.dur}ms linear ${t.delay}ms forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function SparkleLayer({ sparkles }: { sparkles: Sparkle[] }) {
  return (
    <>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="pf-celebration__sparkle"
          style={{
            left: `calc(50% + ${s.x}px)`,
            top: `calc(50% + ${s.y}px)`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animation: `ft-sparkle 1000ms ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Triple starburst — 3 staggered firework explosions with radial spark rays, trailing confetti, and sparkle twinkles. */
export function ModalCelebrationsFireworksTriple() {
  const rays = useMemo(makeRays, [])
  const trails = useMemo(makeTrails, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgRays = useMemo(() => rays.filter((r) => r.layer === 'bg'), [rays])
  const fgRays = useMemo(() => rays.filter((r) => r.layer === 'fg'), [rays])
  const bgTrails = useMemo(() => trails.filter((t) => t.layer === 'bg'), [trails])
  const fgTrails = useMemo(() => trails.filter((t) => t.layer === 'fg'), [trails])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__fireworks-triple">
      {BURSTS.map((b, i) => (
        <div
          key={`flash-${i}`}
          className="pf-celebration__flash"
          style={{
            left: `calc(50% + ${b.cx}px)`,
            top: `calc(50% + ${b.cy}px)`,
            animation: `ft-flash 220ms ease-out ${b.delay * 1000}ms forwards`,
          }}
        />
      ))}
      {BURSTS.map((b, i) => (
        <div
          key={`ring-${i}`}
          className="pf-celebration__ring"
          style={{
            left: `calc(50% + ${b.cx}px)`,
            top: `calc(50% + ${b.cy}px)`,
            borderColor: b.colors[0],
            animation: `ft-ring 600ms ease-out ${b.delay * 1000 + 20}ms forwards`,
          }}
        />
      ))}

      <div className="pf-celebration__depth-bg">
        <RayLayer rays={bgRays} />
        <TrailLayer trails={bgTrails} />
      </div>
      <div className="pf-celebration__depth-fg">
        <RayLayer rays={fgRays} />
        <TrailLayer trails={fgTrails} />
      </div>
      <div className="pf-celebration__effects">
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
