import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic7.module.css'
interface LightsCircleStatic7Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 3
const linearEase = 'linear' as const

// Glow variant for comet trail - long gradual fadeout
const glowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
      repeat: Infinity,
      ease: linearEase,
    },
  },
}

const cometTimes: number[] = [0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1]

const RADIUS = 80

// No staggerChildren — per-bulb delay is applied directly in each child's
// variant transition so that both glow and bulb of the same physical bulb
// share an identical delay (matching CSS animation-delay behavior).
const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

function LightsCircleStatic7({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic7Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = animationDuration / numBulbs

  // Bulb variants use resolved rgba values instead of CSS var() references
  // because Motion cannot interpolate CSS custom property strings in keyframe arrays.
  const bulbVariants = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.off,
        boxShadow: `0 0 2px ${colors.offGlow30}`,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.on,
          colors.on,
          colors.onBlend5Off,
          colors.blend70,
          colors.blend40,
          colors.blend30,
          colors.offBlend10On,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 2px ${colors.offGlow30}`,
          `0 0 12px ${colors.onGlow100}, 0 0 18px ${colors.onGlow80}`,
          `0 0 10px ${colors.onGlow90}, 0 0 15px ${colors.onGlow70}`,
          `0 0 8px ${colors.onGlow75}, 0 0 12px ${colors.onGlow55}`,
          `0 0 6px ${colors.onGlow60}, 0 0 9px ${colors.onGlow40}`,
          `0 0 4px ${colors.onGlow45}`,
          `0 0 3px ${colors.onGlow30}`,
          `0 0 2px ${colors.offGlow35}`,
          `0 0 2px ${colors.offGlow30}`,
          `0 0 2px ${colors.offGlow30}`,
        ],
        transition: {
          duration: animationDuration,
          times: cometTimes,
          repeat: Infinity,
          ease: linearEase,
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
        const perBulbGlowVariants = {
          hidden: glowVariants.hidden,
          show: {
            ...glowVariants.show,
            transition: { ...glowVariants.show.transition, delay: bulbDelay },
          },
        }
        const perBulbBulbVariants = {
          hidden: bulbVariants.hidden,
          show: {
            ...bulbVariants.show,
            transition: { ...bulbVariants.show.transition, delay: bulbDelay },
          },
        }
        return (
          <div
            key={i}
            className={styles['pf-lights-static-7-fm__bulb-wrapper']}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-7-fm__glow']}
              variants={perBulbGlowVariants}
            />
            <m.div
              className={styles['pf-lights-static-7-fm__bulb']}
              variants={perBulbBulbVariants}
            />
          </div>
        )
      }),
    [numBulbs, delayPerBulb, bulbVariants]
  )
  return (
    <div
      className={styles['pf-lights-static-7-fm']}
      data-animation-id="lights__circle-static-7"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend30': colors.blend30,
          '--bulb-blend40': colors.blend40,
          '--bulb-blend70': colors.blend70,
          '--bulb-off-blend-10on': colors.offBlend10On,
          '--bulb-on-blend-5off': colors.onBlend5Off,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow90': colors.onGlow90,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow75': colors.onGlow75,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow55': colors.onGlow55,
          '--bulb-on-glow45': colors.onGlow45,
          '--bulb-on-glow40': colors.onGlow40,
          '--bulb-on-glow30': colors.onGlow30,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-7-fm__container']}
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic7 }
