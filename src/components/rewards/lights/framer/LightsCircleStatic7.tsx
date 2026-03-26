import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic7Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 3

// Glow variant for comet trail - long gradual fadeout
const glowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 1, 0.9, 0.75, 0.6, 0.45, 0.3, 0.15, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
}

// Bulb variant for comet - bright flash followed by long trailing fadeout (35% of duration)
const bulbVariants = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend40)`,
      `var(--bulb-blend30)`,
      `var(--bulb-off-blend-10on)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 15px var(--bulb-on-glow70)`,
      `0 0 8px var(--bulb-on-glow75), 0 0 12px var(--bulb-on-glow55)`,
      `0 0 6px var(--bulb-on-glow60), 0 0 9px var(--bulb-on-glow40)`,
      `0 0 4px var(--bulb-on-glow45)`,
      `0 0 3px var(--bulb-on-glow30)`,
      `0 0 2px var(--bulb-off-glow35)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 1],
      repeat: Infinity,
      ease: 'linear' as const,
    },
  },
}
const RADIUS = 80

function LightsCircleStatic7({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic7Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: animationDuration / Math.max(1, numBulbs),
        },
      },
    }),
    [numBulbs]
  )
  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        return (
          <div
            key={i}
            className="lights-circle-static-7__bulb-wrapper"
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className="lights-circle-static-7__glow"
              variants={glowVariants}
              style={{ animation: 'none' }}
            />
            <m.div
              className="lights-circle-static-7__bulb"
              variants={bulbVariants}
              style={{ animation: 'none' }}
            />
          </div>
        )
      }),
    [numBulbs]
  )
  return (
    <div
      className="lights-circle-static-7"
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
        className="lights-circle-static-7__container"
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
