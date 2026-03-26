import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic5Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 4

// Glow variant for sparkle effect
const glowVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.3, 1, 0.6, 0.2, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Bulb variant for quick flash sparkle
const bulbVariants = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-on)`,
      `var(--bulb-on-blend-5off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 4px var(--bulb-off-glow40)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 8px var(--bulb-on-glow70)`,
      `0 0 4px var(--bulb-off-glow40)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const RADIUS = 80

function LightsCircleStatic5({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic5Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: (animationDuration * 0.37) / Math.max(1, numBulbs),
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
            className="lights-circle-static-5__bulb-wrapper"
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className="lights-circle-static-5__glow"
              variants={glowVariants}
              style={{ animation: 'none' }}
            />
            <m.div
              className="lights-circle-static-5__bulb"
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
      className="lights-circle-static-5"
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
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className="lights-circle-static-5__container"
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
