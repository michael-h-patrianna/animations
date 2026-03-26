import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic4Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 7

// Winner bulb glow variant (first bulb - celebration)
const glowVariantsWinner = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0, 1, 1],
    transition: {
      duration: animationDuration,
      times: [0, 0.86, 0.87, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Winner bulb variant with dramatic celebration
const bulbVariantsWinner = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [`var(--bulb-off)`, `var(--bulb-off)`, `var(--bulb-on)`, `var(--bulb-on)`],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 20px var(--bulb-on-glow100), 0 0 30px var(--bulb-on-glow95)`,
      `0 0 20px var(--bulb-on-glow100), 0 0 30px var(--bulb-on-glow95)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.86, 0.87, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Regular bulb glow variant
// Phase 1: Counter-clockwise -> Phase 2: Clockwise -> Phase 3: Synchronized pulses
const glowVariantsRegular = {
  hidden: { opacity: 0 },
  show: {
    opacity: [
      0,
      0,
      0.85,
      0.85,
      0.4,
      0, // Phase 1: Counter-clockwise
      0,
      0.85,
      0.85,
      0.4,
      0, // Phase 2: Clockwise
      0,
      0.9,
      0.9,
      0,
      0.9,
      0.9,
      0,
      0.9,
      0.9,
      0, // Phase 3: Pulse
    ],
    transition: {
      duration: animationDuration,
      times: [
        0, 0.02, 0.06, 0.06, 0.08, 0.35, 0.42, 0.46, 0.46, 0.47, 0.65, 0.68, 0.7, 0.7, 0.71, 0.75,
        0.77, 0.77, 0.78, 0.82, 0.84, 0.84, 1,
      ],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Regular bulb variant with complex multi-phase animation
const bulbVariantsRegular = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`, // Phase 1
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`, // Phase 2
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-off)`, // Phase 3
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 9px var(--bulb-on-gradient), 0 0 14px var(--bulb-on-glow65)`,
      `0 0 9px var(--bulb-on-gradient), 0 0 14px var(--bulb-on-glow65)`,
      `0 0 5px var(--bulb-on-glow55)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 9px var(--bulb-on-gradient), 0 0 14px var(--bulb-on-glow65)`,
      `0 0 9px var(--bulb-on-gradient), 0 0 14px var(--bulb-on-glow65)`,
      `0 0 5px var(--bulb-on-glow55)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 16px var(--bulb-on-glow70)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 16px var(--bulb-on-glow70)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 16px var(--bulb-on-glow70)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 16px var(--bulb-on-glow70)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 16px var(--bulb-on-glow70)`,
      `0 0 10px var(--bulb-on-glow90), 0 0 16px var(--bulb-on-glow70)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: {
      duration: animationDuration,
      times: [
        0, 0.02, 0.06, 0.06, 0.08, 0.35, 0.42, 0.46, 0.46, 0.47, 0.65, 0.68, 0.7, 0.7, 0.71, 0.75,
        0.77, 0.77, 0.78, 0.82, 0.84, 0.84, 1,
      ],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const RADIUS = 80

function LightsCircleStatic4({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic4Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: (animationDuration / Math.max(1, numBulbs)) * 0.12,
        },
      },
    }),
    [numBulbs]
  )
  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        const isWinner = i === 0
        return (
          <div
            key={i}
            className="lights-circle-static-4__bulb-wrapper"
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className="lights-circle-static-4__glow"
              variants={isWinner ? glowVariantsWinner : glowVariantsRegular}
              style={{ animation: 'none' }}
            />
            <m.div
              className="lights-circle-static-4__bulb"
              variants={isWinner ? bulbVariantsWinner : bulbVariantsRegular}
              style={{ animation: 'none' }}
            />
          </div>
        )
      }),
    [numBulbs]
  )
  return (
    <div
      className="lights-circle-static-4"
      data-animation-id="lights__circle-static-4"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-gradient': colors.onGradient,
          '--bulb-on-glow100': colors.onGlow100,
          '--bulb-on-glow95': colors.onGlow95,
          '--bulb-on-glow90': colors.onGlow90,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow65': colors.onGlow65,
          '--bulb-on-glow55': colors.onGlow55,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className="lights-circle-static-4__container"
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
