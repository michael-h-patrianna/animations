/**
 * Modal entrance — slides down from above with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideDownSoft.module.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import styles from './ModalBaseSlideDownSoft.module.css'

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
  onAnimationComplete,
}: ModalBaseSlideDownSoftProps) {
  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div data-animation-id="modal-base__slide-down-soft">
      <div
        className={`${styles['pf-modal-slide-down']}${className ? ` ${className}` : ''}`}
        style={{ ...style, ...cssVars }}
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget) return
          onAnimationComplete?.()
        }}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBaseSlideDownSoft = memo(ModalBaseSlideDownSoftComponent)
