import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic4.module.css'
interface LightsCircleStatic4Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 7
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1]

// Winner bulb glow variant (first bulb - celebration)
const glowVariantsWinner = {
  hidden: { opacity: 0.5 },
  show: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: animationDuration,
      times: [0, 0.86, 0.87, 1],
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

// Regular bulb glow variant
// Phase 1: Counter-clockwise -> Phase 2: Clockwise -> Phase 3: Synchronized pulses
// CSS reverse-chase-glow times: 0%/94%, 2%/6%, 8%, 42%/46%, 47%, 68%/70%, 71%, 75%/77%, 78%, 82%/84%, 100%
const reverseChaseTimes: number[] = [
  0, 0.02, 0.06, 0.08, 0.42, 0.46, 0.47, 0.68, 0.7, 0.71, 0.75, 0.77, 0.78, 0.82, 0.84, 0.94, 1.0,
]

const glowVariantsRegular = {
  hidden: { opacity: 0.5 },
  show: {
    opacity: [
      0, // 0%: off
      0.85, // 2%: Phase 1 on
      0.85, // 6%: Phase 1 on hold
      0.4, // 8%: Phase 1 fade
      0.85, // 42%: Phase 2 on
      0.85, // 46%: Phase 2 on hold
      0.4, // 47%: Phase 2 fade
      0.9, // 68%: Phase 3 pulse 1
      0.9, // 70%: Phase 3 pulse 1 hold
      0, // 71%: Phase 3 off
      0.9, // 75%: Phase 3 pulse 2
      0.9, // 77%: Phase 3 pulse 2 hold
      0, // 78%: Phase 3 off
      0.9, // 82%: Phase 3 pulse 3
      0.9, // 84%: Phase 3 pulse 3 hold
      0, // 94%: settle off
      0, // 100%: off
    ],
    transition: {
      duration: animationDuration,
      times: reverseChaseTimes,
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

function LightsCircleStatic4({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic4Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = (animationDuration / numBulbs) * 0.12

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
          `0 0 20px ${colors.onGlow100}, 0 0 30px ${colors.onGlow95}`,
          `0 0 20px ${colors.onGlow100}, 0 0 30px ${colors.onGlow95}`,
        ],
        transition: {
          duration: animationDuration,
          times: [0, 0.86, 0.87, 1],
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
          colors.off, // 0%
          colors.on, // 2%: Phase 1 on
          colors.on, // 6%: Phase 1 on hold
          colors.blend70, // 8%: Phase 1 fade
          colors.on, // 42%: Phase 2 on
          colors.on, // 46%: Phase 2 on hold
          colors.blend70, // 47%: Phase 2 fade
          colors.on, // 68%: Phase 3 pulse 1
          colors.on, // 70%: pulse 1 hold
          colors.off, // 71%: off
          colors.on, // 75%: Phase 3 pulse 2
          colors.on, // 77%: pulse 2 hold
          colors.off, // 78%: off
          colors.on, // 82%: Phase 3 pulse 3
          colors.on, // 84%: pulse 3 hold
          colors.off, // 94%: settle off
          colors.off, // 100%: off
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`, // 0%
          `0 0 9px ${colors.onGlow90}, 0 0 14px ${colors.onGlow65}`, // 2%
          `0 0 9px ${colors.onGlow90}, 0 0 14px ${colors.onGlow65}`, // 6%
          `0 0 5px ${colors.onGlow55}`, // 8%
          `0 0 9px ${colors.onGlow90}, 0 0 14px ${colors.onGlow65}`, // 42%
          `0 0 9px ${colors.onGlow90}, 0 0 14px ${colors.onGlow65}`, // 46%
          `0 0 5px ${colors.onGlow55}`, // 47%
          `0 0 10px ${colors.onGlow90}, 0 0 16px ${colors.onGlow70}`, // 68%
          `0 0 10px ${colors.onGlow90}, 0 0 16px ${colors.onGlow70}`, // 70%
          `0 0 2px ${colors.offGlow30}`, // 71%
          `0 0 10px ${colors.onGlow90}, 0 0 16px ${colors.onGlow70}`, // 75%
          `0 0 10px ${colors.onGlow90}, 0 0 16px ${colors.onGlow70}`, // 77%
          `0 0 2px ${colors.offGlow30}`, // 78%
          `0 0 10px ${colors.onGlow90}, 0 0 16px ${colors.onGlow70}`, // 82%
          `0 0 10px ${colors.onGlow90}, 0 0 16px ${colors.onGlow70}`, // 84%
          `0 0 2px ${colors.offGlow30}`, // 94%
          `0 0 2px ${colors.offGlow30}`, // 100%
        ],
        transition: {
          duration: animationDuration,
          times: reverseChaseTimes,
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
            className={styles['pf-lights-static-4-fm__bulb-wrapper']}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-4-fm__glow']}
              variants={addDelay(glowBase, bulbDelay)}
            />
            <m.div
              className={styles['pf-lights-static-4-fm__bulb']}
              variants={addDelay(bulbBase, bulbDelay)}
            />
          </div>
        )
      }),
    [numBulbs, delayPerBulb, bulbVariantsWinner, bulbVariantsRegular]
  )
  return (
    <div
      className={styles['pf-lights-static-4-fm']}
      data-animation-id="lights__circle-static-4"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow95': colors.onGlow95,
          '--bulb-on-glow90': colors.onGlow90,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow65': colors.onGlow65,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow55': colors.onGlow55,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-4-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic4 }
