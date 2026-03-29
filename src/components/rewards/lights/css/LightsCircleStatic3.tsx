import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import styles from './LightsCircleStatic3.module.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic3Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 5

function LightsCircleStatic3({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic3Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = (ANIMATION_DURATION / numBulbs) * 0.08

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        return (
          <div
            key={i}
            className={styles['lights-circle-static-3__bulb-wrapper']}
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--bulb-index': i,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className={styles['lights-circle-static-3__glow']} />
            <div className={styles['lights-circle-static-3__bulb']} />
          </div>
        )
      }),
    [numBulbs, delayPerBulb]
  )

  return (
    <div
      className={styles['lights-circle-static-3']}
      data-animation-id="lights__circle-static-3"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <div className={styles['lights-circle-static-3__container']}>{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic3 }
