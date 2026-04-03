import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic3.module.css'
interface LightsCircleStatic3Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 5
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1]

// Winner bulb glow variant (first bulb - celebration)
// CSS: 0%/79% → 0, 80% → 1, 86%/100% → 0.95
const glowVariantsWinner = {
  hidden: { opacity: 0.5 },
  show: {
    opacity: [0, 0, 1, 0.95, 0.95],
    transition: {
      duration: animationDuration,
      times: [0, 0.79, 0.8, 0.86, 1],
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

// Regular bulb glow variant (all other bulbs)
// CSS: 0%/92% → 0, 1% → 0.8, 4% → 0.8, 6% → 0.4, 8% → 0, 30%/45% → 1, 55% → 0.8, 57% → 0.4, 59%/100% → 0
const regularTimes: number[] = [0, 0.01, 0.04, 0.06, 0.08, 0.3, 0.45, 0.55, 0.57, 0.59, 1.0]

const glowVariantsRegular = {
  hidden: { opacity: 0.5 },
  show: {
    opacity: [0, 0.8, 0.8, 0.4, 0, 1, 1, 0.8, 0.4, 0, 0],
    transition: {
      duration: animationDuration,
      times: regularTimes,
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

const RADIUS = 80

// No staggerChildren — per-bulb delay is applied directly in each child's
// variant transition so that both glow and bulb of the same physical bulb
// share an identical delay (matching CSS animation-delay behavior).
const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

function addDelay<
  H extends Record<string, string | number>,
  S extends Record<string, unknown> & { transition: Record<string, unknown> },
>(base: { hidden: H; show: S }, delay: number) {
  return {
    hidden: base.hidden,
    show: { ...base.show, transition: { ...base.show.transition, delay } },
  }
}

function LightsCircleStatic3({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic3Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = (animationDuration / numBulbs) * 0.08

  // Bulb variants use resolved rgba values instead of CSS var() references
  // because Motion cannot interpolate CSS custom property strings in keyframe arrays.
  const bulbVariantsWinner = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.on,
        boxShadow: `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
      },
      show: {
        backgroundColor: [colors.off, colors.off, colors.on, colors.on],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 15px ${colors.onGlow100}, 0 0 25px ${colors.onGlow80}`,
          `0 0 15px ${colors.onGlow100}, 0 0 25px ${colors.onGlow80}`,
        ],
        transition: {
          duration: animationDuration,
          times: [0, 0.79, 0.8, 1],
          repeat: Infinity,
          ease: easeInOut,
        },
      },
    }),
    [colors]
  )

  const bulbVariantsRegular = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.on,
        boxShadow: `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.on,
          colors.on,
          colors.blend70,
          colors.off,
          colors.on,
          colors.on,
          colors.on,
          colors.blend70,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 8px ${colors.onGlow80}, 0 0 12px ${colors.onGlow60}`,
          `0 0 8px ${colors.onGlow80}, 0 0 12px ${colors.onGlow60}`,
          `0 0 4px ${colors.onGlow50}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 12px ${colors.onGlow100}, 0 0 18px ${colors.onGlow80}`,
          `0 0 12px ${colors.onGlow100}, 0 0 18px ${colors.onGlow80}`,
          `0 0 8px ${colors.onGlow80}, 0 0 12px ${colors.onGlow60}`,
          `0 0 4px ${colors.onGlow50}`,
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

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        const isWinner = i === 0
        const bulbDelay = i * delayPerBulb
        const glowBase = isWinner ? glowVariantsWinner : glowVariantsRegular
        const bulbBase = isWinner ? bulbVariantsWinner : bulbVariantsRegular
        return (
          <div
            key={i}
            className={styles['pf-lights-static-3-fm__bulb-wrapper']}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-3-fm__glow']}
              variants={addDelay(glowBase, bulbDelay)}
            />
            <m.div
              className={styles['pf-lights-static-3-fm__bulb']}
              variants={addDelay(bulbBase, bulbDelay)}
            />
          </div>
        )
      }),
    [numBulbs, delayPerBulb, bulbVariantsWinner, bulbVariantsRegular]
  )
  return (
    <div
      className={styles['pf-lights-static-3-fm']}
      data-animation-id="lights__circle-static-3"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-3-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic3 }
