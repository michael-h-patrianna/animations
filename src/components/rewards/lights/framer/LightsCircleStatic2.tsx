import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic2.module.css'
interface LightsCircleStatic2Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 1.6

// Glow variant for chase effect
// CSS times: 0%/85% off, 1-15% ramp, 16%/100% off
const chaseTimes: number[] = [
  0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 1.0,
]
const chaseEase: [number, number, number, number] = [0.42, 0, 0.58, 1]

const glowVariants = {
  hidden: { opacity: 0.5 },
  show: {
    opacity: [0, 0.1, 0.25, 0.45, 0.7, 0.9, 0.9, 0.75, 0.6, 0.4, 0.2, 0.08, 0, 0],
    transition: {
      duration: animationDuration,
      times: chaseTimes,
      repeat: Infinity,
      ease: chaseEase,
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

function LightsCircleStatic2({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic2Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = animationDuration / numBulbs

  // Bulb variants use resolved rgba values instead of CSS var() references
  // because Motion cannot interpolate CSS custom property strings in keyframe arrays.
  const bulbVariants = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.on,
        boxShadow: `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.offBlend10On,
          colors.offTint30,
          colors.blend40,
          colors.blend70,
          colors.on,
          colors.on,
          colors.onBlend5Off,
          colors.blend70,
          colors.blend40,
          colors.offTint30,
          colors.offBlend10On,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow35}`,
          `0 0 3px ${colors.offGlow40}`,
          `0 0 5px ${colors.onGlow50}, 0 0 8px ${colors.onGlow35}`,
          `0 0 7px ${colors.onGlow70}, 0 0 11px ${colors.onGlow50}`,
          `0 0 10px ${colors.onGlow90}, 0 0 15px ${colors.onGlow70}`,
          `0 0 10px ${colors.onGlow90}, 0 0 15px ${colors.onGlow70}`,
          `0 0 8px ${colors.onGlow80}, 0 0 13px ${colors.onGlow60}`,
          `0 0 6px ${colors.onGlow65}, 0 0 10px ${colors.onGlow45}`,
          `0 0 4px ${colors.onGlow50}`,
          `0 0 3px ${colors.offGlow40}`,
          `0 0 2px ${colors.offGlow35}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: chaseTimes,
          repeat: Infinity,
          ease: chaseEase,
        },
      },
    }),
    [colors]
  )

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        const bulbDelay = i * delayPerBulb
        return (
          <div
            key={i}
            className={styles['pf-lights-static-2-fm__bulb-wrapper']}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-2-fm__glow']}
              variants={addDelay(glowVariants, bulbDelay)}
            />
            <m.div
              className={styles['pf-lights-static-2-fm__bulb']}
              variants={addDelay(bulbVariants, bulbDelay)}
            />
          </div>
        )
      }),
    [numBulbs, delayPerBulb, bulbVariants]
  )
  return (
    <div
      className={styles['pf-lights-static-2-fm']}
      data-animation-id="lights__circle-static-2"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend40': colors.blend40,
          '--bulb-blend70': colors.blend70,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-off-blend-10on': colors.offBlend10On,
          '--bulb-on-blend-5off': colors.onBlend5Off,
          '--bulb-on-glow90': colors.onGlow90,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow65': colors.onGlow65,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-on-glow45': colors.onGlow45,
          '--bulb-on-glow35': colors.onGlow35,
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-2-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic2 }
