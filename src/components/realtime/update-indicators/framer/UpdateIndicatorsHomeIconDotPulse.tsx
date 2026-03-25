/**
 * Notification dot — gentle breathing pulse with soft glow ring.
 * Overlays an animated dot on any element passed as children.
 * Port to React Native: translate animate/transition to Moti MotiView props.
 *
 * Copy-paste files: this file + UpdateIndicatorsHomeIconDotPulse.css + ../SharedTypes.ts
 * Runtime deps: react, motion
 *
 * Usage: <UpdateIndicatorsHomeIconDotPulse dotColor="#ff0000"><MyIcon /></UpdateIndicatorsHomeIconDotPulse>
 */
import * as m from 'motion/react-m'
import { easeInOut } from 'motion/react'
import { memo } from 'react'
import { DOT_COLOR, ringTint } from '@/components/realtime/update-indicators/SharedDefaults'
import type { DotIndicatorProps } from '@/components/realtime/update-indicators/SharedTypes'

function UpdateIndicatorsHomeIconDotPulseComponent({
  children,
  dotColor = DOT_COLOR,
  dotSize = 14,
  duration = 1400,
}: DotIndicatorProps) {
  const durS = duration / 1000
  const ringBorder = `${Math.round(dotSize * 0.57)}px solid ${ringTint(dotColor, 25)}`

  const dot = (
    <m.span
      className="pf-update-indicator__dot pf-update-indicator__dot--pulse"
      style={{
        width: dotSize,
        height: dotSize,
        background: dotColor,
        animation: 'none',
      }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{
        duration: durS,
        ease: easeInOut,
      }}
    >
      <m.span
        className="pf-update-indicator__dot-ring"
        style={{
          inset: `${-Math.round(dotSize * 0.57)}px`,
          border: ringBorder,
          animation: 'none',
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: durS, ease: easeInOut }}
      />
    </m.span>
  )

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__home-icon-dot-pulse">
      {children !== undefined ? (
        <div className="pf-update-indicator__anchor">
          {children}
          {dot}
        </div>
      ) : (
        dot
      )}
    </div>
  )
}

export const UpdateIndicatorsHomeIconDotPulse = memo(UpdateIndicatorsHomeIconDotPulseComponent)
