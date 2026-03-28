import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import styles from './LightsCircleStatic5.module.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic5Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 4

function LightsCircleStatic5({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic5Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = (ANIMATION_DURATION * 0.37) / numBulbs

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        return (
          <div
            key={i}
            className={styles['lights-circle-static-5__bulb-wrapper']}
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--bulb-index': i,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className={styles['lights-circle-static-5__glow']} />
            <div className={styles['lights-circle-static-5__bulb']} />
          </div>
        )
      }),
    [numBulbs, delayPerBulb]
  )

  return (
    <div
      className={styles['lights-circle-static-5']}
      data-animation-id="lights__circle-static-5"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <div className={styles['lights-circle-static-5__container']}>{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic5 }
