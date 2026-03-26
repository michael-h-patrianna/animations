import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic6Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 4.8
const groupSize = 3

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
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Strong beat bulb variant (1st in group)
const bulbVariantsStrong = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint30)`,
      `var(--bulb-on)`,
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
      `0 0 12px var(--bulb-on-glow100), 0 0 18px var(--bulb-on-glow80)`,
      `0 0 8px var(--bulb-on-glow70)`,
      `0 0 4px var(--bulb-off-glow40)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.03, 0.08, 0.1, 0.12, 0.14, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Weak beat glow variant (2nd and 3rd in group) - dimmer and shorter
const glowVariantsWeak = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.2, 0.7, 0.7, 0.4, 0.15, 0, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Weak beat bulb variant (2nd and 3rd in group)
const bulbVariantsWeak = {
  hidden: {
    backgroundColor: `var(--bulb-off)`,
    boxShadow: `0 0 2px var(--bulb-off-glow30)`,
  },
  show: {
    backgroundColor: [
      `var(--bulb-off)`,
      `var(--bulb-off-tint20)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend70)`,
      `var(--bulb-blend40)`,
      `var(--bulb-off-tint20)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
    ],
    boxShadow: [
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 3px var(--bulb-off-glow35)`,
      `0 0 7px var(--bulb-on-glow70), 0 0 10px var(--bulb-on-glow50)`,
      `0 0 7px var(--bulb-on-glow70), 0 0 10px var(--bulb-on-glow50)`,
      `0 0 5px var(--bulb-on-glow50)`,
      `0 0 3px var(--bulb-off-glow35)`,
      `0 0 2px var(--bulb-off-glow30)`,
      `0 0 2px var(--bulb-off-glow30)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.01, 0.02, 0.05, 0.07, 0.09, 0.11, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
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
            className={`lights-circle-static-6__bulb-wrapper beat-${positionInGroup + 1}`}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className="lights-circle-static-6__glow"
              variants={addDelay(glowBase, totalDelay)}
              style={{ animation: 'none' }}
            />
            <m.div
              className="lights-circle-static-6__bulb"
              variants={addDelay(bulbBase, totalDelay)}
              style={{ animation: 'none' }}
            />
          </div>
        )
      }),
    [numBulbs, delayPerGroup]
  )
  return (
    <div
      className="lights-circle-static-6"
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
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-off-glow40': colors.offGlow40,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <m.div
        className="lights-circle-static-6__container"
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
