/** Shared firework particle model for modal-celebrations CSS and Framer variants. */

import { randBetween } from './utils'

/* ─── Defaults ─── */

export const FIREWORK_DEFAULT_BURST_COUNT = 5
export const FIREWORK_DEFAULT_PARTICLES_PER_BURST = 50
export const FIREWORK_DEFAULT_DURATION_MS = 2500
export const FIREWORK_SPREAD_WIDTH = 250
export const FIREWORK_SPREAD_HEIGHT = 200
export const FIREWORK_GRAVITY_DISTANCE_PX = 100
/** Upper bound of per-particle stagger delay (seconds). Used for burst completion detection. */
export const FIREWORK_PARTICLE_MAX_DELAY_S = 0.3

/** Single particle instance within one burst. */
export type FireworkParticle = {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  /** Index into the consumer's particleImages array, or fallback shape index. */
  imageIndex: number
  delay: number
}

/** One firework burst anchor position and its particle payload. */
export type FireworkBurst = {
  id: number
  posX: number
  posY: number
  delay: number
  particles: FireworkParticle[]
}

function generateParticles(
  count: number,
  width: number,
  height: number,
  variantCount: number
): FireworkParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randBetween(-width / 2, width / 2),
    y: Math.random() * height - height / 1.2,
    rotation: randBetween(-360, 360),
    scale: randBetween(0.5, 1.3),
    imageIndex: Math.floor(Math.random() * variantCount),
    delay: randBetween(0, 0.3),
  }))
}

export interface FireworkConfig {
  burstCount?: number
  particlesPerBurst?: number
  /** Total cycle duration in ms. Bursts are distributed across this window. */
  durationMs?: number
  /** Number of image or fallback shape variants for random assignment. */
  variantCount: number
}

/** Generate one wave of bursts distributed across the cycle duration with natural jitter. */
export function generateFireworkBursts(config: FireworkConfig): FireworkBurst[] {
  const burstCount = Math.max(1, config.burstCount ?? FIREWORK_DEFAULT_BURST_COUNT)
  const particlesPerBurst = Math.max(
    1,
    config.particlesPerBurst ?? FIREWORK_DEFAULT_PARTICLES_PER_BURST
  )
  const cycleDurationMs = config.durationMs ?? FIREWORK_DEFAULT_DURATION_MS
  const cycleDurationS = cycleDurationMs / 1000
  const variantCount = Math.max(1, config.variantCount)

  // Proportional timing: at default 2500ms, gap=0.3s jitter=0.2s (matches original)
  const baseGap = cycleDurationS * 0.12
  const jitterRange = baseGap * 0.67

  return Array.from({ length: burstCount }, (_, i) => ({
    id: i,
    posX: randBetween(15, 85),
    posY: randBetween(10, 60),
    delay: i * baseGap + randBetween(0, jitterRange),
    particles: generateParticles(
      particlesPerBurst,
      FIREWORK_SPREAD_WIDTH,
      FIREWORK_SPREAD_HEIGHT,
      variantCount
    ),
  }))
}
