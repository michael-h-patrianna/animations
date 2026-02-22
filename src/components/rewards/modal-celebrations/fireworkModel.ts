/** Shared firework particle model for modal-celebrations CSS and Framer variants. */

export const FIREWORK_BURST_COUNT = 5
export const FIREWORK_PARTICLES_PER_BURST = 50
export const FIREWORK_SPREAD_WIDTH = 250
export const FIREWORK_SPREAD_HEIGHT = 200
export const FIREWORK_DURATION_SECONDS = 1.5
export const FIREWORK_GRAVITY_DISTANCE_PX = 100
export const FIREWORK_RETRIGGER_INTERVAL_MS = 2500
export const FIREWORK_WAVE_LIFETIME_MS = 4500
export const FIREWORK_CYCLE_SECONDS = FIREWORK_RETRIGGER_INTERVAL_MS / 1000

/** Single image particle instance within one burst. */
export type FireworkImageParticle = {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  imageIndex: number
  delay: number
}

/** One firework burst anchor position and its particle payload. */
export type FireworkBurst = {
  id: number
  posX: number
  posY: number
  delay: number
  imageParticles: FireworkImageParticle[]
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function generateImageParticles(
  count: number,
  width: number,
  height: number,
  imageCount: number
): FireworkImageParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(-width / 2, width / 2),
    y: Math.random() * height - height / 1.2,
    rotation: randomBetween(-360, 360),
    scale: randomBetween(0.5, 1.3),
    imageIndex: Math.floor(Math.random() * imageCount),
    delay: randomBetween(0, 0.3),
  }))
}

/** Generate one wave of bursts that can overlap with previous and upcoming waves. */
export function generateFireworkBursts(imageCount: number): FireworkBurst[] {
  const safeImageCount = Math.max(1, imageCount)

  return Array.from({ length: FIREWORK_BURST_COUNT }, (_, i) => ({
    id: i,
    posX: randomBetween(15, 85),
    posY: randomBetween(10, 60),
    delay: i * 0.3 + randomBetween(0, 0.2),
    imageParticles: generateImageParticles(
      FIREWORK_PARTICLES_PER_BURST,
      FIREWORK_SPREAD_WIDTH,
      FIREWORK_SPREAD_HEIGHT,
      safeImageCount
    ),
  }))
}
