/**
 * Modal entrance — drifts in from the left with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideRightDrift.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseSlideRightDrift.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 68

interface ModalBaseSlideRightDriftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideRightDriftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalBaseSlideRightDriftProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-overlay-opacity': overlayOpacity,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div
      className="pf-modal-slide-right"
      style={cssVars}
      data-animation-id="modal-base__slide-right-drift"
    >
      <div
        className={`pf-modal-slide-right__content${className ? ` ${className}` : ''}`}
        style={style}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSlideRightDrift = memo(ModalBaseSlideRightDriftComponent)
