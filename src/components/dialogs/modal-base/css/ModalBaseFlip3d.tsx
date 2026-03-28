/**
 * Modal entrance — 3D card flip from 180deg with scale-up. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseFlip3d.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import styles from './ModalBaseFlip3d.module.css'

const DEFAULT_DURATION = 800
const DEFAULT_PERSPECTIVE = 1200

interface ModalBaseFlip3dProps extends ModalEntranceProps {
  perspective?: number
}

function ModalBaseFlip3dComponent({
  children,
  duration = DEFAULT_DURATION,
  perspective = DEFAULT_PERSPECTIVE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseFlip3dProps) {
  return (
    <div
      data-animation-id="modal-base__flip-3d"
      style={{ '--pf-entrance-duration': `${duration}ms`, perspective } as React.CSSProperties}
    >
      <div
        className={`${styles['pf-modal-flip-3d']}${className ? ` ${className}` : ''}`}
        style={style}
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

export const ModalBaseFlip3d = memo(ModalBaseFlip3dComponent)
