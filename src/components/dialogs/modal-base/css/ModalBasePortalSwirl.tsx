/**
 * Modal entrance — portal swirl with 720deg rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBasePortalSwirl.css + SharedTypes.ts
 * Runtime deps: react
 */

import { memo } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import './ModalBasePortalSwirl.css'

const DEFAULT_DURATION = 800

function ModalBasePortalSwirlComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
}: ModalEntranceProps) {
  return (
    <div data-animation-id="modal-base__portal-swirl">
      <div
        className={`pf-modal-portal${className ? ` ${className}` : ''}`}
        style={{ ...style, '--pf-entrance-duration': `${duration}ms` } as React.CSSProperties}
      >
        <ModalPlaceholder>{children}</ModalPlaceholder>
      </div>
    </div>
  )
}

export const ModalBasePortalSwirl = memo(ModalBasePortalSwirlComponent)
