import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic3Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 5

// Winner bulb glow variant (first bulb - celebration)
const glowVariantsWinner = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0, 1, 0.95],
    transition: {
      duration: animationDuration,
      times: [0, 0.79, 0.8, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Winner bulb variant with big celebration glow
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
      `0 0 15px var(--bulb-on-glow100), 0 0 25px var(--bulb-on-glow80)`,
      `0 0 15px var(--bulb-on-glow100), 0 0 25px var(--bulb-on-glow80)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.79, 0.8, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Regular bulb glow variant (all other bulbs)
const glowVariantsRegular = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.8, 0.8, 0.4, 0, 1, 0.8, 0.4, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.04, 0.06, 0.08, 0.3, 0.55, 0.57, 0.59],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Regular bulb variant with multi-phase animation
// Phase 1: Sequential chase -> Phase 2: All bulbs ON (blur) -> Phase 3: Sequential again
const bulbVariantsRegular = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`,
      `var(--bulb-on)`,
      `var(--bulb-on)`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`,
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
      `0 0 4px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 8px var(--bulb-on-glow80), 0 0 12px var(--bulb-on-glow60)`,
      `0 0 4px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.04, 0.06, 0.08, 0.3, 0.55, 0.57, 0.59],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const RADIUS = 80

function LightsCircleStatic3({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic3Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 1 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: (animationDuration / Math.max(1, numBulbs)) * 0.08,
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
            className="lights-circle-static-3__bulb-wrapper"
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className="lights-circle-static-3__glow"
              variants={isWinner ? glowVariantsWinner : glowVariantsRegular}
              style={{ animation: 'none' }}
            />
            <m.div
              className="lights-circle-static-3__bulb"
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
      className="lights-circle-static-3"
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
        className="lights-circle-static-3__container"
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
