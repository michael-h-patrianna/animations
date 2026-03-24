import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import './LightsCircleStatic4.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic4Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 7

function LightsCircleStatic4({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic4Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const delayPerBulb = (ANIMATION_DURATION / numBulbs) * 0.12

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        return (
          <div
            key={i}
            className="lights-circle-static-4__bulb-wrapper"
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--bulb-index': i,
                '--delay-per-bulb': `${delayPerBulb}s`,
              } as CSSProperties
            }
          >
            <div className="lights-circle-static-4__glow" />
            <div className="lights-circle-static-4__bulb" />
          </div>
        )
      }),
    [numBulbs, delayPerBulb]
  )

  return (
    <div
      className="lights-circle-static-4"
      data-animation-id="lights__circle-static-4"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend70': colors.blend70,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <div className="lights-circle-static-4__container">{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic4 }
