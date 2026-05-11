/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Modal entrance — shatter-assemble with jittery rotation. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseShatterAssemble.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts + @/utils/useCssReducedMotionCallback.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseShatterAssemble.module.css'

const DEFAULT_DURATION = 850

function ModalBaseShatterAssembleComponent({
  children,
  duration = DEFAULT_DURATION,
  className,
  style,
  onAnimationComplete,
}: ModalEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  return (
    <div data-animation-id="modal-base__shatter-assemble">
      <div
        ref={containerRef}
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
