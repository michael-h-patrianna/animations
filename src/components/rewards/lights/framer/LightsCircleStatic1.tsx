import type { CSSProperties } from 'react'
import { calculateBulbColors } from '@/utils/colors'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { useMemo } from 'react'

import styles from './LightsCircleStatic1.module.css'
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
// CSS times: 0%/42% ON, 43% blend, 44%/92% OFF, 93% blend, 94%/100% ON
const evenTimes: number[] = [0, 0.42, 0.43, 0.44, 0.92, 0.93, 0.94, 1.0]
const evenEase: [number, number, number, number] = [0.4, 0, 0.2, 1]

const glowOuterVariantsEven = {
  hidden: { opacity: 0.65 },
  show: {
    opacity: [0.65, 0.65, 0.3, 0, 0, 0.3, 0.65, 0.65],
    transition: {
      duration: animationDuration,
      times: evenTimes,
      repeat: Infinity,
      ease: evenEase,
    },
  },
}
const glowInnerVariantsEven = {
  hidden: { opacity: 0.8 },
  show: {
    opacity: [0.8, 0.8, 0.4, 0, 0, 0.4, 0.8, 0.8],
    transition: {
      duration: animationDuration,
      times: evenTimes,
      repeat: Infinity,
      ease: evenEase,
    },
  },
}
const filamentVariantsEven = {
  hidden: { opacity: 0.85 },
  show: {
    opacity: [0.85, 0.85, 0.4, 0, 0, 0.4, 0.85, 0.85],
    transition: {
      duration: animationDuration,
      times: evenTimes,
      repeat: Infinity,
      ease: evenEase,
    },
  },
}
// Odd bulbs: multi-layer glow effects
// CSS times: 0%/42% OFF, 43% blend, 44%/92% ON, 93% blend, 94%/100% OFF
const oddTimes = evenTimes
const oddEase = evenEase

const glowOuterVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0, 0.3, 0.65, 0.65, 0.3, 0, 0],
    transition: {
      duration: animationDuration,
      times: oddTimes,
      repeat: Infinity,
      ease: oddEase,
    },
  },
}
const glowInnerVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0, 0.4, 0.8, 0.8, 0.4, 0, 0],
    transition: {
      duration: animationDuration,
      times: oddTimes,
      repeat: Infinity,
      ease: oddEase,
    },
  },
}
const filamentVariantsOdd = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0, 0.4, 0.85, 0.85, 0.4, 0, 0],
    transition: {
      duration: animationDuration,
      times: oddTimes,
      repeat: Infinity,
      ease: oddEase,
    },
  },
}
// Motion keyframe arrays require interpolatable string values — CSS custom properties
// cannot be interpolated. These white-alpha border values are constant (independent of onColor).
// eslint-disable-next-line animation-rules/no-hardcoded-colors -- Motion keyframe interpolation requires resolved rgba values
const BORDER_ON = 'rgba(255, 255, 255, 0.35)'
// eslint-disable-next-line animation-rules/no-hardcoded-colors
const BORDER_BLEND = 'rgba(255, 255, 255, 0.22)'
// eslint-disable-next-line animation-rules/no-hardcoded-colors
const BORDER_OFF = 'rgba(255, 255, 255, 0.1)'

const RADIUS = 80

function LightsCircleStatic1({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic1Props) {
  const prefersReducedMotion = useReducedMotion()
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])

  // Bulb variants use resolved rgba values instead of CSS var() references
  // because Motion cannot interpolate CSS custom property strings in keyframe arrays.
  // borderColor values are constant white at varying opacities (independent of onColor).
  const bulbVariantsEven = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.on,
        boxShadow: `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
        transform: `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
        borderColor: BORDER_ON,
      },
      show: {
        backgroundColor: [
          colors.on,
          colors.on,
          colors.blend70,
          colors.off,
          colors.off,
          colors.blend70,
          colors.on,
          colors.on,
        ],
        boxShadow: [
          `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
          `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
          `0 0 2px ${colors.onGlow50}, 0 0 0px transparent`,
          `0 0 0px transparent, 0 0 0px transparent`,
          `0 0 0px transparent, 0 0 0px transparent`,
          `0 0 2px ${colors.onGlow50}, 0 0 0px transparent`,
          `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
          `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
        ],
        transform: [
          `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
          `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
          `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
          `translate(-50%, -50%) scale(1) rotate(0deg)`,
          `translate(-50%, -50%) scale(1) rotate(0deg)`,
          `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
          `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
          `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
        ],
        borderColor: [
          BORDER_ON,
          BORDER_ON,
          BORDER_BLEND,
          BORDER_OFF,
          BORDER_OFF,
          BORDER_BLEND,
          BORDER_ON,
          BORDER_ON,
        ],
        transition: {
          duration: animationDuration,
          times: evenTimes,
          repeat: Infinity,
          ease: evenEase,
        },
      },
    }),
    [colors]
  )

  const bulbVariantsOdd = useMemo(
    () => ({
      hidden: {
        backgroundColor: colors.off,
        boxShadow: `0 0 0px transparent, 0 0 0px transparent`,
        transform: `translate(-50%, -50%) scale(1) rotate(0deg)`,
        borderColor: BORDER_OFF,
      },
      show: {
        backgroundColor: [
          colors.off,
          colors.off,
          colors.blend70,
          colors.on,
          colors.on,
          colors.blend70,
          colors.off,
          colors.off,
        ],
        boxShadow: [
          `0 0 0px transparent, 0 0 0px transparent`,
          `0 0 0px transparent, 0 0 0px transparent`,
          `0 0 2px ${colors.onGlow50}, 0 0 0px transparent`,
          `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
          `0 0 4px ${colors.onGlow70}, 0 0 6px ${colors.onGlow50}`,
          `0 0 2px ${colors.onGlow50}, 0 0 0px transparent`,
          `0 0 0px transparent, 0 0 0px transparent`,
          `0 0 0px transparent, 0 0 0px transparent`,
        ],
        transform: [
          `translate(-50%, -50%) scale(1) rotate(0deg)`,
          `translate(-50%, -50%) scale(1) rotate(0deg)`,
          `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
          `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
          `translate(-50%, -50%) scale(1.12) rotate(1.5deg)`,
          `translate(-50%, -50%) scale(1.06) rotate(0.75deg)`,
          `translate(-50%, -50%) scale(1) rotate(0deg)`,
          `translate(-50%, -50%) scale(1) rotate(0deg)`,
        ],
        borderColor: [
          BORDER_OFF,
          BORDER_OFF,
          BORDER_BLEND,
          BORDER_ON,
          BORDER_ON,
          BORDER_BLEND,
          BORDER_OFF,
          BORDER_OFF,
        ],
        transition: {
          duration: animationDuration,
          times: oddTimes,
          repeat: Infinity,
          ease: oddEase,
        },
      },
    }),
    [colors]
  )

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const angle = (i * 360) / numBulbs - 90
        const rad = (angle * Math.PI) / 180
        const isEven = i % 2 === 0
        return (
          <div
            key={i}
            className={styles['pf-lights-static-1-fm__bulb-wrapper']}
            data-testid="bulb-wrapper"
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <m.div
              className={styles['pf-lights-static-1-fm__glow-outer']}
              variants={isEven ? glowOuterVariantsEven : glowOuterVariantsOdd}
            />
            <m.div
              className={styles['pf-lights-static-1-fm__glow-inner']}
              variants={isEven ? glowInnerVariantsEven : glowInnerVariantsOdd}
            />
            <m.div
              className={styles['pf-lights-static-1-fm__bulb']}
              variants={isEven ? bulbVariantsEven : bulbVariantsOdd}
            >
              <m.div
                className={styles['pf-lights-static-1-fm__filament']}
                variants={isEven ? filamentVariantsEven : filamentVariantsOdd}
              />
              <div className={styles['pf-lights-static-1-fm__glass-shine']} />
            </m.div>
          </div>
        )
      }),
    [numBulbs, bulbVariantsEven, bulbVariantsOdd]
  )
  return (
    <div
      className={styles['pf-lights-static-1-fm']}
      data-animation-id="lights__circle-static-1"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow50': colors.onGlow50,
        } as CSSProperties
      }
    >
      <m.div
        className={styles['pf-lights-static-1-fm__container']}
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
