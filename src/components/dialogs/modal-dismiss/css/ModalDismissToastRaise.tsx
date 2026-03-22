/**
 * Auto-dismiss wrapper — content rises from below, exits upward after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <ModalDismissToastRaise duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastRaise>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '../MockToastContent'
import type { AutoDismissProps } from '../SharedTypes'

const DEFAULT_DURATION = 3600

function ModalDismissToastRaiseComponent({
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
    const entryDuration = reducedMotion ? 10 : 420
    const exitDuration = reducedMotion ? 10 : 320
    const easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'

    el.animate(
      [
        { transform: 'translate3d(0, 120%, 0) scale(0.96)', opacity: '0' },
        { transform: 'translate3d(0, -8%, 0) scale(1.02)', opacity: '1', offset: 0.7 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: entryDuration, easing, fill: 'forwards' }
    )

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(0, 12%, 0) scale(0.98)', opacity: '0.9', offset: 0.5 },
          { transform: 'translate3d(0, -120%, 0) scale(0.9)', opacity: '0' },
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
      data-animation-id="modal-dismiss__toast-raise"
      className={children === undefined ? 'pf-dismiss-stage' : undefined}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(0, 120%, 0) scale(0.96)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const ModalDismissToastRaise = memo(ModalDismissToastRaiseComponent)
