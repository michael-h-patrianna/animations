import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic5.module.css'
interface LightsCircleStatic5Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 4
const easeInOut: [number, number, number, number] = [0.42, 0, 0.58, 1]

// Glow variant for sparkle effect
const glowVariants = {
  hidden: { opacity: 0.5 },
  show: {
    opacity: [0, 0.3, 1, 0.6, 0.2, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 1],
      repeat: Infinity,
      ease: easeInOut,
    },
  },
}

const sparkleTimes: number[] = [0, 0.02, 0.04, 0.06, 0.08, 0.1, 1]

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

function LightsCircleStatic5({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic5Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = (animationDuration * 0.37) / numBulbs

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
          colors.offTint30,
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
          `0 0 8px ${colors.onGlow70}`,
          `0 0 4px ${colors.offGlow40}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: sparkleTimes,
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
        const bulbDelay = i * delayPerBulb
        return (
          <div
            key={i}
            className={styles['pf-lights-static-5-fm__bulb-wrapper']}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-5-fm__glow']}
              variants={addDelay(glowVariants, bulbDelay)}
            />
            <m.div
              className={styles['pf-lights-static-5-fm__bulb']}
              variants={addDelay(bulbVariants, bulbDelay)}
            />
          </div>
        )
      }),
    [numBulbs, delayPerBulb, bulbVariants]
  )
  return (
    <div
      className={styles['pf-lights-static-5-fm']}
      data-animation-id="lights__circle-static-5"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-on-blend-5off': colors.onBlend5Off,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-5-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic5 }
