/**
 * Modal entrance — shatter-assemble with jittery rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseShatterAssemble.module.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import styles from './ModalBaseShatterAssemble.module.css'

const DEFAULT_DURATION = 850

function ModalBaseShatterAssembleComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__shatter-assemble">
      <div
        className={`${styles['pf-modal-shatter']}${className ? ` ${className}` : ''}`}
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

export const ModalBaseShatterAssemble = memo(ModalBaseShatterAssembleComponent)
