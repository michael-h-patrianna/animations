/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Modal entrance — origami unfold from rotateX(-180). CSS variant.
 *
 * Copy-paste files: this file + ModalBaseUnfoldOrigami.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts + @/utils/useCssReducedMotionCallback.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseUnfoldOrigami.module.css'

const DEFAULT_DURATION = 900
const DEFAULT_PERSPECTIVE = 1200

interface ModalBaseUnfoldOrigamiProps extends ModalEntranceProps {
  perspective?: number
}

function ModalBaseUnfoldOrigamiComponent({
  children,
  duration = DEFAULT_DURATION,
  perspective = DEFAULT_PERSPECTIVE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseUnfoldOrigamiProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  return (
    <div
      data-animation-id="modal-base__unfold-origami"
      style={{ '--pf-entrance-duration': `${duration}ms`, perspective } as React.CSSProperties}
    >
      <div
        ref={containerRef}
        className={`${styles['pf-modal-origami']}${className ? ` ${className}` : ''}`}
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

export const ModalBaseUnfoldOrigami = memo(ModalBaseUnfoldOrigamiComponent)
