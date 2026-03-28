import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import styles from './LightsCircleStatic8.module.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic8Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 4

function LightsCircleStatic8({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic8Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const safeNumBulbs = Math.max(2, numBulbs)
  const halfBulbs = Math.floor(safeNumBulbs / 2)
  const delayPerBulb = ANIMATION_DURATION / halfBulbs

  const bulbs = useMemo(
    () =>
      Array.from({ length: safeNumBulbs }, (_, i) => {
        const rad = ((i * 360) / safeNumBulbs - 90) * (Math.PI / 180)
        const isFirstHalf = i < halfBulbs
        const chaseIndex = isFirstHalf ? i : safeNumBulbs - i - 1
        return (
          <div
            key={i}
            className={`${styles['lights-circle-static-8__bulb-wrapper']} ${isFirstHalf ? styles['first-half'] : styles['second-half']}`}
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--chase-index': chaseIndex,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className={styles['lights-circle-static-8__glow']} />
            <div className={styles['lights-circle-static-8__bulb']} />
          </div>
        )
      }),
    [safeNumBulbs, halfBulbs, delayPerBulb]
  )

  return (
    <div
      className={styles['lights-circle-static-8']}
      data-animation-id="lights__circle-static-8"
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
      <div className={styles['lights-circle-static-8__container']}>{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic8 }
