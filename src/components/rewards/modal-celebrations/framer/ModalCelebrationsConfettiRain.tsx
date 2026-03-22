/**
 * Windswept confetti shower with 3D tumble, depth layers, wave timing, and top-edge flash.
 *
 * Copy-paste files: this file + ../SharedCelebrationTypes.ts + ../utils.ts + ../shared.css
 * Runtime deps: react, motion
 */

import * as m from 'motion/react-m'
import { memo, useEffect, useMemo } from 'react'

import type { CelebrationBaseProps } from '../SharedCelebrationTypes'
import { CELEBRATION_COLORS_HEX } from '../SharedCelebrationTypes'
import {
  CONFETTI_SHAPES,
  pickRandom,
  randBetween,
  type ConfettiShape,
} from '../utils'

/* ─── Props ─── */

interface ModalCelebrationsConfettiRainProps extends CelebrationBaseProps {
  /** Total confetti particles across all waves. Default 50. */
  particleCount?: number
}

/* ─── Types ─── */

type Particle = {
  id: number
  shape: ConfettiShape
  color: string
  left: number
  driftX1: number
  driftX2: number
  driftX3: number
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

const DEFAULT_PARTICLE_COUNT = 50
const DEFAULT_DURATION_MS = 2100

/* ─── Generators ─── */

function makeParticles(count: number, colors: readonly string[], timeScale: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const wave = i < Math.floor(count / 3) ? 0 : i < Math.floor((count * 2) / 3) ? 1 : 2
    const waveBase = [0, 0.28, 0.56][wave]!
    const layer: 'bg' | 'fg' = i % 3 === 0 ? 'bg' : 'fg'
    const isBg = layer === 'bg'

    return {
      id: i,
      shape: pickRandom(CONFETTI_SHAPES),
      color: colors[i % colors.length]!,
      left: randBetween(5, 95),
      driftX1: randBetween(-20, 20),
      driftX2: randBetween(-45, 45),
      driftX3: randBetween(-30, 55),
      rotX: randBetween(-180, 180),
      rotY: randBetween(-180, 180),
      rotZ: randBetween(-120, 120),
      delay: (waveBase + randBetween(0, 0.18)) * timeScale,
      dur: (isBg ? randBetween(1.8, 2.4) : randBetween(1.2, 1.7)) * timeScale,
      scale: isBg ? randBetween(0.9, 1.4) : randBetween(0.6, 1.0),
      layer,
    }
  })
}

function makeSparkles(timeScale: number): Sparkle[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: randBetween(-130, 130),
    y: randBetween(-40, 80),
    delay: (0.9 + i * 0.1 + randBetween(0, 0.15)) * timeScale,
    size: randBetween(2.5, 5),
  }))
}

/* ─── Sub-components ─── */

function TopFlash({ timeScale }: { timeScale: number }) {
  return (
    <m.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background:
          'linear-gradient(90deg, transparent 5%, var(--pf-anim-white-90) 50%, transparent 95%)',
        zIndex: 3,
        pointerEvents: 'none' as const,
        animation: 'none',
      }}
      initial={{ opacity: 0, scaleX: 0.3 }}
      animate={{ opacity: [0, 1, 0.6, 0], scaleX: [0.3, 1, 1, 1] }}
      transition={{ duration: 0.5 * timeScale, times: [0, 0.2, 0.5, 1], ease: 'easeOut' }}
    />
  )
}

function RainPiece({ p }: { p: Particle }) {
  const isBg = p.layer === 'bg'

  return (
    <m.span
      className={`pf-celebration__confetti pf-celebration__confetti--${p.shape}`}
      style={{
        left: `${p.left}%`,
        top: '-5%',
        background: p.color,
        opacity: isBg ? 0.45 : undefined,
        transformStyle: 'preserve-3d' as const,
        animation: 'none',
      }}
      initial={{ y: 0, x: 0, scale: 0, rotateX: 0, rotateY: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: [0, 80, 180, 280],
        x: [0, p.driftX1, p.driftX2, p.driftX3],
        scale: [0, p.scale, p.scale, p.scale * 0.4],
        rotateX: [0, p.rotX * 0.4, p.rotX * 0.8, p.rotX],
        rotateY: [0, p.rotY * 0.3, p.rotY * 0.7, p.rotY],
        rotate: [0, p.rotZ * 0.4, p.rotZ * 0.8, p.rotZ],
        opacity: [0, isBg ? 0.45 : 1, isBg ? 0.35 : 0.8, 0],
      }}
      transition={{
        duration: p.dur,
        delay: p.delay,
        times: [0, 0.2, 0.6, 1],
        ease: [0.12, 0, 0.39, 0],
      }}
    />
  )
}

function SparkleDot({ s, timeScale }: { s: Sparkle; timeScale: number }) {
  return (
    <m.span
      className="pf-celebration__sparkle"
      style={{
        left: '50%',
        marginLeft: s.x,
        top: '50%',
        marginTop: s.y,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animation: 'none',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.4, 0.6, 1.1, 0], opacity: [0, 1, 0.3, 0.7, 0] }}
      transition={{ duration: 1.1 * timeScale, delay: s.delay, times: [0, 0.2, 0.5, 0.75, 1], ease: 'easeOut' }}
    />
  )
}

/* ─── Main ─── */

function ModalCelebrationsConfettiRainComponent({
  particleCount = DEFAULT_PARTICLE_COUNT,
  colors = CELEBRATION_COLORS_HEX as unknown as string[],
  duration,
  onComplete,
}: ModalCelebrationsConfettiRainProps) {
  const timeScale = (duration ?? DEFAULT_DURATION_MS) / DEFAULT_DURATION_MS

  const particles = useMemo(() => makeParticles(particleCount, colors, timeScale), [particleCount, colors, timeScale])
  const sparkles = useMemo(() => makeSparkles(timeScale), [timeScale])
  const bgParts = useMemo(() => particles.filter((p) => p.layer === 'bg'), [particles])
  const fgParts = useMemo(() => particles.filter((p) => p.layer === 'fg'), [particles])

  useEffect(() => {
    if (onComplete === undefined) return
    const maxTime = Math.max(
      ...particles.map((p) => p.delay + p.dur),
      ...sparkles.map((s) => s.delay + 1.1 * timeScale),
    )
    const timer = setTimeout(onComplete, maxTime * 1000 + 50)
    return () => clearTimeout(timer)
  }, [particles, sparkles, timeScale, onComplete])

  return (
    <div className="pf-celebration" data-animation-id="modal-celebrations__confetti-rain">
      <TopFlash timeScale={timeScale} />

      <div className="pf-celebration__depth-bg">
        {bgParts.map((p) => (
          <RainPiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__depth-fg">
        {fgParts.map((p) => (
          <RainPiece key={p.id} p={p} />
        ))}
      </div>
      <div className="pf-celebration__effects">
        {sparkles.map((s) => (
          <SparkleDot key={s.id} s={s} timeScale={timeScale} />
        ))}
      </div>
    </div>
  )
}

export const ModalCelebrationsConfettiRain = memo(ModalCelebrationsConfettiRainComponent)
