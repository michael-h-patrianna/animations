/**
 * Modal entrance — slides down from above with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideDownSoft.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '../MockModalContent'
import type { ModalEntranceProps } from '../SharedTypes'
import './ModalBaseSlideDownSoft.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 60

interface ModalBaseSlideDownSoftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideDownSoftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
}: ModalBaseSlideDownSoftProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div data-animation-id="modal-base__slide-down-soft">
      <div
        className={`pf-modal-slide-down${className ? ` ${className}` : ''}`}
        style={{ ...style, ...cssVars }}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSlideDownSoft = memo(ModalBaseSlideDownSoftComponent)
