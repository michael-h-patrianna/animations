import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic8Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 4

// No stagger at container level -- first/second half need different chase directions.
const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

// Regular bulb glow variant
const glowVariantsRegular = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.3, 0.9, 0.9, 0.6, 0.2, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Regular bulb variant
const bulbVariantsRegular = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    filter: `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
    ],
    filter: [
      `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
      `drop-shadow(0 0 4px var(--bulb-off-glow40))`,
      `drop-shadow(0 0 10px var(--bulb-on-glow90)) drop-shadow(0 0 15px var(--bulb-on-glow70))`,
      `drop-shadow(0 0 10px var(--bulb-on-glow90)) drop-shadow(0 0 15px var(--bulb-on-glow70))`,
      `drop-shadow(0 0 7px var(--bulb-on-glow70))`,
      `drop-shadow(0 0 4px var(--bulb-off-glow40))`,
      `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
      `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Collision bulb glow variant (where they meet with white flash)
const glowVariantsCollision = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 1, 1, 1, 0.7, 0.3, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Collision bulb variant with white flash at collision point
const bulbVariantsCollision = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    filter: `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-on)`,
      `var(--pf-white)`,
      `var(--bulb-on)`,
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
    ],
    filter: [
      `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
      `drop-shadow(0 0 4px var(--bulb-off-glow40))`,
      `drop-shadow(0 0 15px var(--bulb-on-glow100)) drop-shadow(0 0 22px var(--bulb-on-glow90))`,
      `drop-shadow(0 0 20px var(--bulb-white-glow100)) drop-shadow(0 0 30px var(--bulb-on-glow100))`,
      `drop-shadow(0 0 15px var(--bulb-on-glow100)) drop-shadow(0 0 22px var(--bulb-on-glow90))`,
      `drop-shadow(0 0 10px var(--bulb-on-glow80))`,
      `drop-shadow(0 0 4px var(--bulb-off-glow40))`,
      `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
      `drop-shadow(0 0 2px var(--bulb-off-glow30))`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const RADIUS = 80

function addDelay<
  H extends Record<string, string | number>,
  S extends Record<string, unknown> & { transition: Record<string, unknown> },
>(base: { hidden: H; show: S }, delay: number) {
  return {
    hidden: base.hidden,
    show: { ...base.show, transition: { ...base.show.transition, delay } },
  }
}

function LightsCircleStatic8({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic8Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const halfBulbs = Math.floor(numBulbs / 2)
  const delayPerBulb = animationDuration / halfBulbs
  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        // First half chases clockwise, second half counter-clockwise
        const isFirstHalf = i < halfBulbs
        const chaseIndex = isFirstHalf ? i : numBulbs - i - 1
        const delay = chaseIndex * delayPerBulb
        const isCollisionBulb =
          (isFirstHalf && i === halfBulbs - 1) || (!isFirstHalf && i === halfBulbs)
        const glowBase = isCollisionBulb ? glowVariantsCollision : glowVariantsRegular
        const bulbBase = isCollisionBulb ? bulbVariantsCollision : bulbVariantsRegular
        return (
          <div
            key={i}
            className={`lights-circle-static-8__bulb-wrapper ${isFirstHalf ? 'first-half' : 'second-half'}`}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div className="lights-circle-static-8__glow" variants={addDelay(glowBase, delay)} />
            <m.div className="lights-circle-static-8__bulb" variants={addDelay(bulbBase, delay)} />
          </div>
        )
      }),
    [numBulbs, halfBulbs, delayPerBulb]
  )
  return (
    <div
      className="lights-circle-static-8"
      data-animation-id="lights__circle-static-8"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-on-blend-5off': colors.onBlend5Off,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow90': colors.onGlow90,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-white-glow100': colors.whiteGlow100,
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className="lights-circle-static-8__container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic8 }
