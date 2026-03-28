/**
 * Modal entrance — elastic zoom with multi-bounce overshoot. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseZoomElastic.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import styles from './ModalBaseZoomElastic.module.css'

const DEFAULT_DURATION = 720

function ModalBaseZoomElasticComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__zoom-elastic">
      <div
        className={`${styles['pf-modal-zoom-elastic']}${className ? ` ${className}` : ''}`}
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

export const ModalBaseZoomElastic = memo(ModalBaseZoomElasticComponent)
