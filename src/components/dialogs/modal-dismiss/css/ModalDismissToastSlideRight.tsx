/**
 * Auto-dismiss wrapper — content slides in from the right, exits right after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <ModalDismissToastSlideRight duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastSlideRight>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '@/components/dialogs/modal-dismiss/MockToastContent'
import type { AutoDismissProps } from '@/components/dialogs/modal-dismiss/SharedTypes'

const DEFAULT_DURATION = 3800

function ModalDismissToastSlideRightComponent({
  children,
  duration = DEFAULT_DURATION,
  onDismiss,
  className,
  style,
}: AutoDismissProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const el = wrapperRef.current
    if (el === null) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const entryDuration = reducedMotion ? 150 : 320
    const exitDuration = reducedMotion ? 120 : 240
    const easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

    el.animate(
      [
        { transform: 'translate3d(140%, 0, 0) scale(0.96)', opacity: '0' },
        { transform: 'translate3d(-6%, 0, 0) scale(1.02)', opacity: '1', offset: 0.7 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: entryDuration, easing, fill: 'forwards' }
    )

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(6%, 0, 0) scale(1.0)', opacity: '0.92', offset: 0.35 },
          { transform: 'translate3d(160%, 0, 0) scale(0.94)', opacity: '0' },
        ],
        { duration: exitDuration, easing, fill: 'forwards' }
      )
      exitAnim.onfinish = () => onDismissRef.current?.()
    }, duration)

    return () => {
      clearTimeout(exitTimer)
      el.getAnimations().forEach((a) => a.cancel())
    }
  }, [duration])

  return (
    <div
      data-animation-id="modal-dismiss__toast-slide-right"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(140%, 0, 0) scale(0.96)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const ModalDismissToastSlideRight = memo(ModalDismissToastSlideRightComponent)
