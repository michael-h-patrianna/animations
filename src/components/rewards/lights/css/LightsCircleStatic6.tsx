import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import './LightsCircleStatic6.css'
import { calculateBulbColors } from '@/utils/colors'

interface LightsCircleStatic6Props {
  numBulbs?: number
  onColor?: string
}

const RADIUS = 80
const ANIMATION_DURATION = 4.8
const GROUP_SIZE = 3

function LightsCircleStatic6({
  numBulbs = 16,
  onColor = 'var(--pf-anim-gold)',
}: LightsCircleStatic6Props) {
  const colors = useMemo(() => calculateBulbColors(onColor), [onColor])
  const numGroups = Math.ceil(numBulbs / GROUP_SIZE)
  const delayPerGroup = ANIMATION_DURATION / numGroups

  const bulbs = useMemo(
    () =>
      Array.from({ length: numBulbs }, (_, i) => {
        const rad = ((i * 360) / numBulbs - 90) * (Math.PI / 180)
        const groupIndex = Math.floor(i / GROUP_SIZE)
        const positionInGroup = i % GROUP_SIZE
        return (
          <div
            key={i}
            className={`lights-circle-static-6__bulb-wrapper beat-${positionInGroup + 1}`}
            style={
              {
                transform: `translate(${RADIUS * Math.cos(rad)}px, ${RADIUS * Math.sin(rad)}px)`,
                '--group-index': groupIndex,
                '--delay-per-group': `${delayPerGroup}s`,
                '--position-in-group': positionInGroup,
              } as CSSProperties
            }
          >
            <div className="lights-circle-static-6__glow" />
            <div className="lights-circle-static-6__bulb" />
          </div>
        )
      }),
    [numBulbs, delayPerGroup]
  )

  return (
    <div
      className="lights-circle-static-6"
      data-animation-id="lights__circle-static-6"
      style={
        {
          '--bulb-on': colors.on,
          '--bulb-off': colors.off,
          '--bulb-blend40': colors.blend40,
          '--bulb-blend70': colors.blend70,
          '--bulb-off-tint20': colors.offTint20,
          '--bulb-off-tint30': colors.offTint30,
          '--bulb-on-glow80': colors.onGlow80,
          '--bulb-on-glow70': colors.onGlow70,
          '--bulb-on-glow60': colors.onGlow60,
          '--bulb-on-glow50': colors.onGlow50,
          '--bulb-off-glow35': colors.offGlow35,
          '--bulb-off-glow30': colors.offGlow30,
        } as CSSProperties
      }
    >
      <div className="lights-circle-static-6__container">{bulbs}</div>
    </div>
  )
}

export { LightsCircleStatic6 }
