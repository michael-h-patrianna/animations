/**
 * Radial Pulse — self-contained expanding ring ripple indicator.
 * Port to React Native: translate animate/transition to Moti. Each ring becomes
 * an absolute-positioned MotiView with staggered delay.
 *
 * Copy-paste files: this file
 * Runtime deps: react, motion
 *
 * Usage: <StandardEffectsRadialPulse ringCount={3} color="rgb(236 195 255 / 32%)" duration={2400} />
 */
import * as m from 'motion/react-m'
import { memo } from 'react'
import {
  INDICATOR_DOT_BORDER_COLOR,
  INDICATOR_DOT_COLOR,
  INDICATOR_RADIAL_RING_COLOR,
} from '@/components/base/standard-effects/SharedDefaults'

interface StandardEffectsRadialPulseProps {
  /** Number of expanding rings. Default: 3 */
  ringCount?: number
  /** Ring border color. Default: 'rgb(236 195 255 / 32%)' */
  color?: string
  /** Center dot color. Default: '#efd7fa' */
  dotColor?: string
  /** Center dot border color. Default: 'rgb(236 195 255 / 15%)' */
  dotBorderColor?: string
  /** Duration of one ring's expansion in ms. Default: 2400 */
  duration?: number
}

function StandardEffectsRadialPulseComponent({
  ringCount = 3,
  color = INDICATOR_RADIAL_RING_COLOR,
  dotColor = INDICATOR_DOT_COLOR,
  dotBorderColor = INDICATOR_DOT_BORDER_COLOR,
  duration = 2400,
}: StandardEffectsRadialPulseProps) {
  const durationS = duration / 1000
  const staggerS = 0.6
  const resolvedColor = color
  const resolvedDotColor = dotColor

  return (
    <div
      style={{ position: 'relative', width: 160, height: 160 }}
      data-animation-id="standard-effects__radial-pulse"
      role="img"
      aria-label="Radial pulse"
    >
      {Array.from({ length: ringCount }, (_, i) => (
        <m.span
          key={i}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 10,
            height: 10,
            margin: '-5px 0 0 -5px',
            borderRadius: '50%',
            border: `2px solid ${resolvedColor}`,
            animation: 'none',
          }}
          animate={{
            scale: [0.1, 7.5],
            opacity: [0.8, 0.12, 0],
          }}
          transition={{
            duration: durationS,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            times: [0, 0.7, 1],
            delay: i * staggerS,
          }}
        />
      ))}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 8,
          height: 8,
          margin: '-4px 0 0 -4px',
          borderRadius: '50%',
          background: resolvedDotColor,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: dotBorderColor,
        }}
      />
    </div>
  )
}

export const StandardEffectsRadialPulse = memo(StandardEffectsRadialPulseComponent)
