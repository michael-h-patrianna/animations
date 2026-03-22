/**
 * Modal entrance — slides up from below with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideUpSoft.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import { DEFAULT_OVERLAY_OPACITY } from '../SharedTypes'
import './ModalBaseSlideUpSoft.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 64

interface ModalBaseSlideUpSoftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideUpSoftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  overlayOpacity = DEFAULT_OVERLAY_OPACITY,
  className,
  style,
}: ModalBaseSlideUpSoftProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-overlay-opacity': overlayOpacity,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div className="pf-modal-slide-up" style={cssVars} data-animation-id="modal-base__slide-up-soft">
      <div className={`pf-modal-slide-up__content${className ? ` ${className}` : ''}`} style={style}>
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSlideUpSoft = memo(ModalBaseSlideUpSoftComponent)
