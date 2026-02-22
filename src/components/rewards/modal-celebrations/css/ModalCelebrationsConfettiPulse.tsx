import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'
import './ModalCelebrationsConfettiPulse.css'

/* ─── Types ─── */

type WaveConfig = {
  delay: number
  maxScale: number
  color: string
  particleCount: number
  spawnRMin: number
  spawnRMax: number
  driftMin: number
  driftMax: number
}

type CssParticle = {
  id: number
  shape: ConfettiShape
  color: string
  spawnX: number
  spawnY: number
  tx: number
  ty: number
  scale: number
  peakOp: number
  rotZ: number
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

const WAVES: WaveConfig[] = [
  { delay: 0, maxScale: 7, color: CELEBRATION_COLORS[0], particleCount: 12, spawnRMin: 20, spawnRMax: 45, driftMin: 22, driftMax: 40 },
  { delay: 0.35, maxScale: 9, color: CELEBRATION_COLORS[2], particleCount: 14, spawnRMin: 35, spawnRMax: 65, driftMin: 28, driftMax: 50 },
  { delay: 0.65, maxScale: 11, color: CELEBRATION_COLORS[3], particleCount: 16, spawnRMin: 50, spawnRMax: 85, driftMin: 32, driftMax: 55 },
]

/* ─── Generators ─── */

function makeParticles(): CssParticle[] {
  const particles: CssParticle[] = []
  let id = 0

  for (let wi = 0; wi < WAVES.length; wi++) {
    const wave = WAVES[wi]

    for (let j = 0; j < wave.particleCount; j++) {
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      const angle = deg2rad((j / wave.particleCount) * 360 + randBetween(-10, 10))
      const spawnR = randBetween(wave.spawnRMin, wave.spawnRMax) * (isBg ? 0.7 : 1)
      const drift = randBetween(wave.driftMin, wave.driftMax) * (isBg ? 0.7 : 1)

      const waveReachFraction = spawnR / (wave.maxScale * 20)
      const spawnDelay = wave.delay + waveReachFraction * 0.3

      particles.push({
        id: id++,
        shape: pickRandom(CONFETTI_SHAPES),
        color: CELEBRATION_COLORS[(wi * wave.particleCount + j) % CELEBRATION_COLORS.length],
        spawnX: Math.cos(angle) * spawnR,
        spawnY: Math.sin(angle) * spawnR,
        tx: Math.cos(angle) * drift,
        ty: Math.sin(angle) * drift,
        scale: isBg ? randBetween(0.5, 0.8) : randBetween(0.7, 1.1),
        peakOp: isBg ? 0.5 : 1,
        rotZ: randBetween(-200, 200),
        delay: (spawnDelay + randBetween(0, 0.03)) * 1000,
        dur: (isBg ? randBetween(1.3, 1.7) : randBetween(1.0, 1.4)) * 1000,
        layer,
      })
    }
  }

  return particles
}

function makeSparkles(): Sparkle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const waveIdx = i % WAVES.length
    const angle = deg2rad((i / 12) * 360 + randBetween(-20, 20))
    const r = randBetween(55, 115)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-5, 10),
      delay: (WAVES[waveIdx].delay + 0.3 + (i / 12) * 0.15 + randBetween(0, 0.1)) * 1000,
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

function ParticleLayer({ particles }: { particles: CssParticle[] }) {
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
          style={
            {
              left: `calc(50% + ${p.spawnX}px)`,
              top: `calc(50% + ${p.spawnY}px)`,
              background: p.color,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--s': p.scale,
              '--peak-op': p.peakOp,
              '--rz': `${p.rotZ}deg`,
              animation: `cp-particle ${p.dur}ms linear ${p.delay}ms forwards`,
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
            animation: `cp-sparkle 1200ms ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Triple shockwave pulse — 3 rhythmic energy waves expand from center, each depositing confetti particles at its passing radius. */
export function ModalCelebrationsConfettiPulse() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-pulse">
      <div
        className="pf-celebration__glow"
        style={{ animation: 'cp-glow 2000ms ease-out forwards' }}
      />
      <div
        className="pf-celebration__flash"
        style={{ animation: 'cp-flash 1400ms ease-out forwards' }}
      />

      {WAVES.map((w, i) => (
        <div
          key={i}
          className="pf-celebration__pulse"
          style={
            {
              borderColor: w.color,
              borderWidth: '3px',
              '--max-scale': w.maxScale,
              animation: `cp-wave 1000ms ease-out ${w.delay * 1000}ms forwards`,
            } as React.CSSProperties
          }
        />
      ))}

      <div className="pf-celebration__depth-bg">
        <ParticleLayer particles={bgParts} />
      </div>
      <div className="pf-celebration__depth-fg">
        <ParticleLayer particles={fgParts} />
      </div>
      <div className="pf-celebration__effects">
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
