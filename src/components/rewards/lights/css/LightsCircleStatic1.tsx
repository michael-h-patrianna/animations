import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import './LightsCircleStatic1.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic1Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80

function LightsCircleStatic1({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic1Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        const isEven = i % 2 === 0
        return (
          <div
            key={i}
            className={`lights-circle-static-1__bulb-wrapper ${isEven ? 'even' : 'odd'}`}
            style={{
              transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
            }}
          >
            <div className="lights-circle-static-1__glow-outer" />
            <div className="lights-circle-static-1__glow-inner" />
            <div className="lights-circle-static-1__bulb">
              <div className="lights-circle-static-1__filament" />
              <div className="lights-circle-static-1__glass-shine" />
            </div>
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
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow50': colors.onGlow50,
        } as CSSProperties
      }
    >
      <div className="lights-circle-static-1__container">{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic1 }
