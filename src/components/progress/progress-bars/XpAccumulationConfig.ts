/* ─── Types ─── */

/** Milestone halo animation entry. */
export type MilestoneAnimation = { id: number; threshold: number }

/** Floating XP indicator shown above the progress bar. */
export interface FloatingXP {
  id: number
  value: number
  percent: number
  offset: number
}

/* ─── Constants ─── */

export const INITIAL_XP = 100
export const MAX_XP = 1000
export const PROGRESS_DURATION = 0.48
export const ORB_IMPACT_DELAY_MS = 420
export const FLOATING_SPAWN_LEAD_MS = 110
export const FLOATING_LIFETIME_MS = 1650
export const GAIN_INTERVAL_MS = 1580
export const FIRST_GAIN_DELAY_MS = 520
export const RESET_DELAY_MS = 2600
export const PROGRESS_EASE: [number, number, number, number] = [0.18, 0.85, 0.25, 1]

export const MULTIPLIER_ZONES = [
  { threshold: 20, multiplier: 2 },
  { threshold: 40, multiplier: 3 },
  { threshold: 60, multiplier: 4 },
  { threshold: 80, multiplier: 5 },
] as const

export const XP_SEQUENCE_RANGES: Array<[number, number]> = [
  [150, 165],
  [205, 222],
  [290, 310],
  [405, 430],
  [525, 552],
  [655, 678],
  [785, 812],
  [910, 940],
  [MAX_XP, MAX_XP],
]

const MIN_SEQUENCE_STEP = 28

/** Returns the active multiplier for a given XP value based on MULTIPLIER_ZONES. */
export function getCurrentMultiplier(xp: number): number {
  const progressPercent = (xp / MAX_XP) * 100
  const activeZone = [...MULTIPLIER_ZONES]
    .reverse()
    .find((zone) => progressPercent >= zone.threshold)
  return activeZone ? activeZone.multiplier : 1
}

/** Computes zone and level CSS bucket classes from a progress percentage. */
export function getProgressBuckets(progressPercent: number) {
  const intensity = Math.min(1, Math.max(0, progressPercent / 100))
  const zoneBucket =
    progressPercent >= 80
      ? 'zone-4'
      : progressPercent >= 60
        ? 'zone-3'
        : progressPercent >= 40
          ? 'zone-2'
          : progressPercent >= 20
            ? 'zone-1'
            : 'zone-0'
  const levelBucket =
    intensity >= 0.8
      ? 'level-4'
      : intensity >= 0.6
        ? 'level-3'
        : intensity >= 0.4
          ? 'level-2'
          : intensity >= 0.2
            ? 'level-1'
            : 'level-0'
  return { zoneBucket, levelBucket }
}

/** Generates a randomised XP target sequence from INITIAL_XP to MAX_XP. */
export function createXpSequence() {
  let current = INITIAL_XP
  return XP_SEQUENCE_RANGES.map(([min, max]) => {
    const span = Math.max(0, max - min)
    const roll = span === 0 ? min : min + Math.random() * span
    const ensured = Math.max(current + MIN_SEQUENCE_STEP, roll)
    const clamped = Math.min(MAX_XP, ensured)
    current = clamped
    return clamped
  })
}
