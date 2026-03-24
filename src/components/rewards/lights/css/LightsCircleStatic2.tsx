import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import './LightsCircleStatic2.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic2Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 1.6

function LightsCircleStatic2({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic2Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = ANIMATION_DURATION / numBulbs

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        return (
          <div
            key={i}
            className="lights-circle-static-2__bulb-wrapper"
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--bulb-index': i,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className="lights-circle-static-2__glow" />
            <div className="lights-circle-static-2__bulb" />
          </div>
        )
      }),
    [numBulbs, delayPerBulb]
  )

  return (
    <div
      className="lights-circle-static-2"
      data-animation-id="lights__circle-static-2"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend40': colors.blend40,
          '--bulb-blend70': colors.blend70,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-on-glow45': colors.onGlow45,
          '--bulb-on-glow35': colors.onGlow35,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <div className="lights-circle-static-2__container">{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic2 }
