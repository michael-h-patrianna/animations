/**
 * Modal entrance — portal swirl with 720deg rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBasePortalSwirl.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts + @/utils/useCssReducedMotionCallback.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBasePortalSwirl.module.css'

const DEFAULT_DURATION = 800

function ModalBasePortalSwirlComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  return (
    <div data-animation-id="modal-base__portal-swirl">
      <div
        ref={containerRef}
        className={`${styles['pf-modal-portal']}${className ? ` ${className}` : ''}`}
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

export const ModalBasePortalSwirl = memo(ModalBasePortalSwirlComponent)
