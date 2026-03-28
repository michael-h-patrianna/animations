/**
 * Modal entrance — ripple expand from zero with scale overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseRippleExpand.module.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import styles from './ModalBaseRippleExpand.module.css'

const DEFAULT_DURATION = 550

function ModalBaseRippleExpandComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__ripple-expand">
      <div
        className={`${styles['pf-modal-ripple']}${className ? ` ${className}` : ''}`}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
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

export const ModalBaseRippleExpand = memo(ModalBaseRippleExpandComponent)
