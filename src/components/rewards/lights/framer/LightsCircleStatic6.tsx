import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic6.module.css'
interface LightsCircleStatic6Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 4.8
const groupSize = 3
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1]

// No stagger at container level -- timing handled via per-bulb delays.
const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

// Strong beat glow variant (1st in group) - brightest and longest
const glowVariantsStrong = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 1, 1, 0.7, 0.3, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.03, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

const strongTimes: number[] = [0, 0.01, 0.03, 0.08, 0.1, 0.12, 0.14, 1]

// Weak beat glow variant (2nd and 3rd in group) - dimmer and shorter
const glowVariantsWeak = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.2, 0.7, 0.7, 0.4, 0.15, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

const weakTimes: number[] = [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1]

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

function LightsCircleStatic6({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic6Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const numGroups = Math.ceil(numBulbs / groupSize)
  const delayPerGroup = animationDuration / numGroups

  // Bulb variants use resolved rgba values instead of CSS var() references
  // because Motion cannot interpolate CSS custom property strings in keyframe arrays.
  const bulbVariantsStrong = useMemo(
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
          `0 0 12px ${colors.onGlow100}, 0 0 18px ${colors.onGlow80}`,
          `0 0 12px ${colors.onGlow100}, 0 0 18px ${colors.onGlow80}`,
          `0 0 8px ${colors.onGlow70}`,
          `0 0 4px ${colors.offGlow40}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: strongTimes,
          repeat: Infinity,
          ease: easeInOut,
        },
      },
    }),
    [colors]
  )

  const bulbVariantsWeak = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.off,
        boxShadow: `0 0 2px ${colors.offGlow30}`,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.offTint20,
          colors.blend70,
          colors.blend70,
          colors.blend40,
          colors.offTint20,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 3px ${colors.offGlow35}`,
          `0 0 7px ${colors.onGlow70}, 0 0 10px ${colors.onGlow50}`,
          `0 0 7px ${colors.onGlow70}, 0 0 10px ${colors.onGlow50}`,
          `0 0 5px ${colors.onGlow50}`,
          `0 0 3px ${colors.offGlow35}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: weakTimes,
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
        const positionInGroup = i % groupSize
        const isStrongBeat = positionInGroup === 0
        const totalDelay = Math.floor(i / groupSize) * delayPerGroup + positionInGroup * 0.15
        const glowBase = isStrongBeat ? glowVariantsStrong : glowVariantsWeak
        const bulbBase = isStrongBeat ? bulbVariantsStrong : bulbVariantsWeak
        return (
          <div
            key={i}
            className={`${styles['pf-lights-static-6-fm__bulb-wrapper']} beat-${positionInGroup + 1}`}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-6-fm__glow']}
              variants={addDelay(glowBase, totalDelay)}
            />
            <m.div
              className={styles['pf-lights-static-6-fm__bulb']}
              variants={addDelay(bulbBase, totalDelay)}
            />
          </div>
        )
      }),
    [numBulbs, delayPerGroup, bulbVariantsStrong, bulbVariantsWeak]
  )
  return (
    <div
      className={styles['pf-lights-static-6-fm']}
      data-animation-id="lights__circle-static-6"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend40': colors.blend40,
          '--bulb-blend70': colors.blend70,
          '--bulb-off-tint20': colors.offTint20,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-on-blend-5off': colors.onBlend5Off,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-6-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic6 }
