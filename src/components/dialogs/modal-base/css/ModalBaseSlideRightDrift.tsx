/**
 * Modal entrance — drifts in from the left with subtle scale and fade. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSlideRightDrift.module.css + ../SharedModalPlaceholder.tsx + ../SharedTypes.ts
 * Runtime deps: react
 */

import { memo, useRef } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/SharedModalPlaceholder'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import { useCssReducedMotionCallback } from '@/utils/useCssReducedMotionCallback'
import styles from './ModalBaseSlideRightDrift.module.css'

const DEFAULT_DURATION = 420
const DEFAULT_DISTANCE = 68

interface ModalBaseSlideRightDriftProps extends ModalEntranceProps {
  distance?: number
}

function ModalBaseSlideRightDriftComponent({
  children,
  duration = DEFAULT_DURATION,
  distance = DEFAULT_DISTANCE,
  className,
  style,
  onAnimationComplete,
}: ModalBaseSlideRightDriftProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useCssReducedMotionCallback(containerRef, onAnimationComplete)

  const cssVars = {
    '--pf-entrance-duration': `${duration}ms`,
    '--pf-slide-distance': `${distance}px`,
  } as React.CSSProperties

  return (
    <div data-animation-id="modal-base__slide-right-drift">
      <div
        ref={containerRef}
        className={`${styles['pf-modal-slide-right']}${className ? ` ${className}` : ''}`}
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

export const ModalBaseSlideRightDrift = memo(ModalBaseSlideRightDriftComponent)
