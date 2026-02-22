import { useMemo } from 'react'

import {
  CELEBRATION_COLORS,
  CONFETTI_SHAPES,
  deg2rad,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'
import './ModalCelebrationsConfettiSpiral.css'

/* ─── Types ─── */

type SpiralParticle = {
  id: number
  shape: ConfettiShape
  color: string
  startAngle: number
  totalOrbit: number
  maxRadius: number
  rotX: number
  rotY: number
  rotZ: number
  delay: number
  dur: number
  scale: number
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

const NUM_ARMS = 3
const PER_ARM = 18

/* ─── Generators ─── */

/** Dynamic tornado: 3 arms × 18, each particle orbits 620-840° while expanding. */
function makeParticles(): SpiralParticle[] {
  const particles: SpiralParticle[] = []

  for (let arm = 0; arm < NUM_ARMS; arm++) {
    const armBase = arm * (360 / NUM_ARMS)

    for (let j = 0; j < PER_ARM; j++) {
      const i = arm * PER_ARM + j
      const layer: 'bg' | 'fg' = j % 3 === 0 ? 'bg' : 'fg'
      const isBg = layer === 'bg'

      particles.push({
        id: i,
        shape: pickRandom(CONFETTI_SHAPES),
        color: CELEBRATION_COLORS[i % CELEBRATION_COLORS.length],
        startAngle: armBase + randBetween(-8, 8),
        totalOrbit: randBetween(620, 840),
        maxRadius: randBetween(85, 150) * (isBg ? 0.65 : 1),
        rotX: randBetween(-130, 130),
        rotY: randBetween(-110, 110),
        rotZ: randBetween(-240, 240),
        delay: j * 30 + randBetween(0, 10),
        dur: isBg ? randBetween(2200, 2800) : randBetween(1800, 2400),
        scale: isBg ? randBetween(0.55, 0.85) : randBetween(0.75, 1.15),
        layer,
      })
    }
  }

  return particles
}

function makeSparkles(): Sparkle[] {
  return Array.from({ length: 12 }, (_, i) => {
    const angle = deg2rad((i / 12) * 360 + randBetween(-15, 15))
    const r = randBetween(45, 100)
    return {
      id: i,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r + randBetween(-5, 15),
      delay: 700 + i * 80 + randBetween(0, 100),
      size: randBetween(2.5, 5),
    }
  })
}

/* ─── Sub-components ─── */

/** Renders particles for one depth layer. */
function SpiralLayer({ particles, peakOpacity }: { particles: SpiralParticle[]; peakOpacity: string }) {
  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
          style={
            {
              left: '50%',
              top: '50%',
              background: p.color,
              transformStyle: 'preserve-3d',
              '--sa': `${p.startAngle}deg`,
              '--to': `${p.totalOrbit}deg`,
              '--mr': `${p.maxRadius}px`,
              '--rx': `${p.rotX}deg`,
              '--ry': `${p.rotY}deg`,
              '--rz': `${p.rotZ}deg`,
              '--s': p.scale,
              '--peak-opacity': peakOpacity,
              animation: `cs-tornado ${p.dur}ms linear ${p.delay}ms forwards`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

/** Sparkle dots scattered along spiral paths. */
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
            animation: `cs-sparkle 1.2s ease-out ${s.delay}ms forwards`,
          }}
        />
      ))}
    </>
  )
}

/* ─── Main ─── */

/** Dynamic tornado confetti — particles orbit center in 3 spiral arms while expanding outward with gravity release. */
export function ModalCelebrationsConfettiSpiral() {
  const particles = useMemo(makeParticles, [])
  const sparkles = useMemo(makeSparkles, [])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-spiral">
      <div className="pf-celebration__flash" style={{ animation: 'cs-flash 250ms ease-out forwards' }} />

      <div className="pf-celebration__depth-bg">
        <SpiralLayer particles={bgParts} peakOpacity="0.5" />
      </div>
      <div className="pf-celebration__depth-fg">
        <SpiralLayer particles={fgParts} peakOpacity="1" />
      </div>
      <div className="pf-celebration__effects">
        <SparkleLayer sparkles={sparkles} />
      </div>
    </div>
  )
}
