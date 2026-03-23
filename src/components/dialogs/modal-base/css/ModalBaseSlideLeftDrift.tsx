/**
 * Modal entrance — drifts in from the right with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideLeftDrift.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseSlideLeftDrift.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 68

interface ModalBaseSlideLeftDriftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideLeftDriftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalBaseSlideLeftDriftProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-overlay-opacity': overlayOpacity,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div
      className="pf-modal-slide-left"
      style={cssVars}
      data-animation-id="modal-base__slide-left-drift"
    >
      <div
        className={`pf-modal-slide-left__content${className ? ` ${className}` : ''}`}
        style={style}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSlideLeftDrift = memo(ModalBaseSlideLeftDriftComponent)
