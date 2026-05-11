/**
 * CSS variant.
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 */
import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import styles from './LightsCircleStatic7.module.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic7Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 3

function LightsCircleStatic7({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic7Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = ANIMATION_DURATION / numBulbs

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        return (
          <div
            key={i}
            className={styles['lights-circle-static-7__bulb-wrapper']}
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--bulb-index': i,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className={styles['lights-circle-static-7__glow']} />
            <div className={styles['lights-circle-static-7__bulb']} />
          </div>
        )
      }),
    [numBulbs, delayPerBulb]
  )

  return (
    <div
      className={styles['lights-circle-static-7']}
      data-animation-id="lights__circle-static-7"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend30': colors.blend30,
          '--bulb-blend40': colors.blend40,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow45': colors.onGlow45,
          '--bulb-on-glow30': colors.onGlow30,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <div className={styles['lights-circle-static-7__container']}>{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic7 }
