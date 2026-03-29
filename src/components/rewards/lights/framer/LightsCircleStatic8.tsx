import type { CSSProperties } from 'react'
import { calculateBulbColors, WHITE } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic8.module.css'
interface LightsCircleStatic8Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 4
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1]

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
      ease: easeInOut,
    },
  },
}

const regularTimes: number[] = [0, 0.02, 0.04, 0.08, 0.1, 0.12, 0.14, 1]

// Collision bulb glow variant (where they meet with white flash)
const glowVariantsCollision = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 1, 1, 1, 0.7, 0.3, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

const collisionTimes: number[] = [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 1]

// Motion keyframe arrays require interpolatable string values — CSS custom properties
// cannot be interpolated. White flash is constant (independent of onColor).
const COLLISION_WHITE = WHITE

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
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const halfBulbs = Math.floor(numBulbs / 2)
  const delayPerBulb = animationDuration / halfBulbs

  // Bulb variants use resolved rgba values instead of CSS var() references
  // because Motion cannot interpolate CSS custom property strings in keyframe arrays.
  const bulbVariantsRegular = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.off,
        boxShadow: `0 0 2px ${colors.offGlow30}`,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.offTint30,
          colors.on,
          colors.on,
          colors.onBlend5Off,
          colors.offTint30,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 4px ${colors.offGlow40}`,
          `0 0 10px ${colors.onGlow90}, 0 0 15px ${colors.onGlow70}`,
          `0 0 10px ${colors.onGlow90}, 0 0 15px ${colors.onGlow70}`,
          `0 0 7px ${colors.onGlow70}`,
          `0 0 4px ${colors.offGlow40}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: regularTimes,
          repeat: Infinity,
          ease: easeInOut,
        },
      },
    }),
    [colors]
  )

  const bulbVariantsCollision = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.off,
        boxShadow: `0 0 2px ${colors.offGlow30}`,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.offTint30,
          colors.on,
          COLLISION_WHITE,
          colors.on,
          colors.onBlend5Off,
          colors.offTint30,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 4px ${colors.offGlow40}`,
          `0 0 15px ${colors.onGlow100}, 0 0 22px ${colors.onGlow90}`,
          `0 0 20px ${colors.whiteGlow100}, 0 0 30px ${colors.onGlow100}`,
          `0 0 15px ${colors.onGlow100}, 0 0 22px ${colors.onGlow90}`,
          `0 0 10px ${colors.onGlow80}`,
          `0 0 4px ${colors.offGlow40}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: collisionTimes,
          repeat: Infinity,
          ease: easeInOut,
        },
      },
    }),
    [colors]
  )

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
            className={`${styles['pf-lights-static-8-fm__bulb-wrapper']} ${isFirstHalf ? 'first-half' : 'second-half'}`}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-8-fm__glow']}
              variants={addDelay(glowBase, delay)}
            />
            <m.div
              className={styles['pf-lights-static-8-fm__bulb']}
              variants={addDelay(bulbBase, delay)}
            />
          </div>
        )
      }),
    [numBulbs, halfBulbs, delayPerBulb, bulbVariantsRegular, bulbVariantsCollision]
  )
  return (
    <div
      className={styles['pf-lights-static-8-fm']}
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
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-white-glow100': colors.whiteGlow100,
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-8-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic8 }
