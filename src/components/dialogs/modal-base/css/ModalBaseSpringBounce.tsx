/**
 * Modal entrance — spring-physics bounce with overshoot settle. CSS variant.
 *
 * Copy-paste files: this file + ModalBaseSpringBounce.css + MockModalContent.tsx + SharedTypes.ts
 * Runtime deps: react
 */

import { memo, type CSSProperties } from 'react'

import { ModalPlaceholder } from '@/components/dialogs/modal-base/MockModalContent'
import type { ModalEntranceProps } from '@/components/dialogs/modal-base/SharedTypes'
import styles from './ModalBaseSpringBounce.module.css'

interface SpringBounceProps extends ModalEntranceProps {
  /** Animation duration in ms. Default: 820 */
  duration?: number
}

function ModalBaseSpringBounceComponent({
  children,
  className,
  style,
  duration = 820,
  onAnimationComplete,
}: SpringBounceProps) {
  const mergedStyle = {
    ...style,
    ['--pf-spring-bounce-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div data-animation-id="modal-base__spring-bounce">
      <div
        className={`${styles['pf-modal-spring']}${className ? ` ${className}` : ''}`}
        style={mergedStyle}
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

export const ModalBaseSpringBounce = memo(ModalBaseSpringBounceComponent)
