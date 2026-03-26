import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'
interface LightsCircleStatic1Props {
  numBulbs?: number
  onColor?: string
}
const animationDuration = 1.2

const containerVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
}

// Even bulbs: multi-layer glow effects
const glowOuterVariantsEven = {
  hidden: { opacity: 0.65 },
  show: {
    opacity: [0.65, 0.3, 0, 0, 0.3, 0.65],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const glowInnerVariantsEven = {
  hidden: { opacity: 0.8 },
  show: {
    opacity: [0.8, 0.4, 0, 0, 0.4, 0.8],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const filamentVariantsEven = {
  hidden: { opacity: 0.85 },
  show: {
    opacity: [0.85, 0.4, 0, 0, 0.4, 0.85],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const bulbVariantsEven = {
  hidden: {
    background: `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
    boxShadow: `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
    transform: `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
    borderColor: `var(--pf-anim-white-35)`,
  },
  show: {
    background: [
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`,
      `var(--bulb-off)`,
      `var(--bulb-blend70)`,
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
    ],
    boxShadow: [
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-on-glow50)`,
      `0 0 0px transparent`,
      `0 0 0px transparent`,
      `0 0 2px var(--bulb-on-glow50)`,
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
    ],
    transform: [
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
    ],
    borderColor: [
      `var(--pf-anim-white-35)`,
      `var(--pf-anim-white-22)`,
      `var(--pf-anim-white-10)`,
      `var(--pf-anim-white-10)`,
      `var(--pf-anim-white-22)`,
      `var(--pf-anim-white-35)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}

// Odd bulbs: multi-layer glow effects
const glowOuterVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.3, 0.65, 0.65, 0.3, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const glowInnerVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 0.8, 0.8, 0.4, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const filamentVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.4, 0.85, 0.85, 0.4, 0],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const bulbVariantsOdd = {
  hidden: {
    background: `var(--bulb-off)`,
    boxShadow: `0 0 0px transparent`,
    transform: `translate(-50%, -50%) scale(1) rotate(0deg)`,
    borderColor: `var(--pf-anim-white-10)`,
  },
  show: {
    background: [
      `var(--bulb-off)`,
      `var(--bulb-blend70)`,
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
      `radial-gradient(circle at 40% 40%, var(--bulb-on), var(--bulb-on-gradient))`,
      `var(--bulb-blend70)`,
      `var(--bulb-off)`,
    ],
    boxShadow: [
      `0 0 0px transparent`,
      `0 0 2px var(--bulb-on-glow50)`,
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
      `0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50)`,
      `0 0 2px var(--bulb-on-glow50)`,
      `0 0 0px transparent`,
    ],
    transform: [
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
      `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
      `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
      `translate(-50%, -50%) scale(1) rotate(0deg)`,
    ],
    borderColor: [
      `var(--pf-anim-white-10)`,
      `var(--pf-anim-white-22)`,
      `var(--pf-anim-white-35)`,
      `var(--pf-anim-white-35)`,
      `var(--pf-anim-white-22)`,
      `var(--pf-anim-white-10)`,
    ],
    transition: {
      duration: animationDuration,
      times: [0, 0.358, 0.367, 0.767, 0.775, 1],
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
}
const RADIUS = 80

function LightsCircleStatic1({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic1Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const angle = (i * 360) / numBulbs - 90
        const rad = (angle * Math.PI) / 180
        const isEven = i % 2 === 0
        return (
          <div
            key={i}
            className="lights-circle-static-1__bulb-wrapper"
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className="lights-circle-static-1__glow-outer"
              variants={isEven ? glowOuterVariantsEven : glowOuterVariantsOdd}
            />
            <m.div
              className="lights-circle-static-1__glow-inner"
              variants={isEven ? glowInnerVariantsEven : glowInnerVariantsOdd}
            />
            <m.div
              className="lights-circle-static-1__bulb"
              variants={isEven ? bulbVariantsEven : bulbVariantsOdd}
            >
              <div className="lights-circle-static-1__glass-shine" />
            </m.div>
            <m.div
              className="lights-circle-static-1__filament"
              variants={isEven ? filamentVariantsEven : filamentVariantsOdd}
            />
          </div>
        )
      }),
    [numBulbs]
  )
  return (
    <div
      className="lights-circle-static-1"
      data-animation-id="lights__circle-static-1"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-gradient': colors.onGradient,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow50': colors.onGlow50,
        } as CSSProperties
      }
    >
      <m.div
        className="lights-circle-static-1__container"
        variants={containerVariants}
        initial="hidden"
        animate={prefersReducedMotion ? 'hidden' : 'show'}
      >
        {bulbs}
      </m.div>
    </div>
  )
}
export { LightsCircleStatic1 }
