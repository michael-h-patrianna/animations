import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import './LightsCircleStatic8.css'
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
  const halfBulbs = Math.floor(numBulbs / 2)
  const delayPerBulb = ANIMATION_DURATION / halfBulbs

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        const isFirstHalf = i < halfBulbs
        const chaseIndex = isFirstHalf ? i : numBulbs - i - 1
        return (
          <div
            key={i}
            className={`lights-circle-static-8__bulb-wrapper ${isFirstHalf ? 'first-half' : 'second-half'}`}
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--chase-index': chaseIndex,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className="lights-circle-static-8__glow" />
            <div className="lights-circle-static-8__bulb" />
          </div>
        )
      }),
    [numBulbs, halfBulbs, delayPerBulb]
  )

  return (
    <div
      className="lights-circle-static-8"
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
      <div className="lights-circle-static-8__container">{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic8 }
