/**
 * Card-pack arrival and anticipation phase effects.
 *
 * PackBody — pack lands with squash-stretch, shakes during anticipation.
 * SeamLight — horizontal glow at the tear line as pressure builds.
 * ArrivalDust — impact particles when the pack lands.
 * EdgeSparks — sparkles escaping near the seam area.
 * SeamCracks — fracture lines appearing from the seam.
 */

import * as m from 'motion/react-m'
import type { CSSProperties } from 'react'

import crystalShatterDustImage from '@/assets/crystal-shatter/crystal-dust.webp'
import crystalShatterSparkleImage from '@/assets/crystal-shatter/crystal-sparkle.webp'

import type { PackPhase } from './SharedCardPackTypes'
import styles from './framer/PrizeRevealCardPackOpen.module.css'

/* ═══════════════════════════════════════════════════
   PACK BODY — drop in with squash-stretch, shake + bulge
   ═══════════════════════════════════════════════════ */

/** Escalating shake — amplitude ramps from gentle tremor to violent judder.
    scaleX oscillates alongside to simulate internal pressure bulging the pack. */
const SHAKE_STEPS = 30

function generateShakeKeyframes() {
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
    sx.push(1 + (i % 2 === 0 ? t * 0.04 : 0))
  }
  x[SHAKE_STEPS] = 0
  y[SHAKE_STEPS] = 0
  rot[SHAKE_STEPS] = 0
  sx[SHAKE_STEPS] = 1
  return { x, y, rot, sx }
}

let _shakeKeyframes: ReturnType<typeof generateShakeKeyframes> | null = null
function getShakeKeyframes() {
  if (!_shakeKeyframes) _shakeKeyframes = generateShakeKeyframes()
  return _shakeKeyframes
}

export function PackBody({ phase, packImage }: { phase: PackPhase; packImage: string }) {
  const isShaking = phase === 'anticipation'
  const isVisible = phase === 'arrival' || phase === 'anticipation'
  const shake = getShakeKeyframes()

  if (!isVisible) return null

  return (
    <m.div
      className={styles['pf-card-pack-fm__pack-body']}
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
        animate={isShaking ? { x: shake.x, y: shake.y, rotate: shake.rot, scaleX: shake.sx } : {}}
        transition={isShaking ? { duration: 1.0, ease: 'linear' } : {}}
      >
        <img
          src={packImage}
          alt=""
          aria-hidden="true"
          className={styles['pf-card-pack-fm__pack-image']}
        />
      </m.div>
    </m.div>
  )
}

/* ═══════════════════════════════════════════════════
   SEAM LIGHT — horizontal glow at pack's tear line
   Light escaping from inside as pressure builds
   ═══════════════════════════════════════════════════ */

export function SeamLight({ phase }: { phase: PackPhase }) {
  if (phase !== 'anticipation') return null

  return (
    <m.div
      className={styles['pf-card-pack-fm__seam']}
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

const ARRIVAL_DUST = Array.from({ length: ARRIVAL_DUST_COUNT }, (_, i) => {
  const angle = (150 + (i / (ARRIVAL_DUST_COUNT - 1)) * 240) * (Math.PI / 180)
  const dist = 20 + Math.random() * 30
  return {
    id: i,
    endX: Math.cos(angle) * dist,
    endY: Math.sin(angle) * Math.abs(Math.sin(angle)) * dist * 0.6,
    size: 3 + Math.random() * 3,
    delay: 0.55 + Math.random() * 0.06,
  }
})

export function ArrivalDust() {
  return (
    <div className={styles['pf-card-pack-fm__arrival-dust-container']}>
      {ARRIVAL_DUST.map((p) => (
        <m.img
          key={p.id}
          src={crystalShatterDustImage}
          alt=""
          aria-hidden="true"
          className={styles['pf-card-pack-fm__arrival-dust']}
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
            delay: p.delay,
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

const EDGE_SPARKS = (() => {
  const packW = 72
  const seamY = -20
  return Array.from({ length: 4 }, (_, i) => {
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
})()

export function EdgeSparks() {
  return (
    <div className={styles['pf-card-pack-fm__edge-spark-container']}>
      {EDGE_SPARKS.map((s) => (
        <m.img
          key={s.id}
          src={crystalShatterSparkleImage}
          alt=""
          aria-hidden="true"
          className={styles['pf-card-pack-fm__edge-spark']}
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

export function SeamCracks() {
  const cracks = [
    { id: 0, x: '30%', rotate: -25, len: 16, delay: 0.3 },
    { id: 1, x: '65%', rotate: 18, len: 22, delay: 0.55 },
    { id: 2, x: '45%', rotate: -40, len: 18, delay: 0.8 },
  ]

  return (
    <div className={styles['pf-card-pack-fm__seam-crack-container']}>
      {cracks.map((c) => (
        <m.div
          key={c.id}
          className={styles['pf-card-pack-fm__seam-crack']}
          style={
            {
              insetInlineStart: c.x,
              rotate: `${c.rotate}deg`,
              '--crack-len': `${c.len}px`,
            } as CSSProperties
          }
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: [0, 1], opacity: [0, 0.8, 0.6] }}
          transition={{ duration: 0.25, delay: c.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
