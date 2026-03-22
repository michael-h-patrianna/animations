/**
 * Auto-dismiss wrapper — content slides in from the left, exits left after timeout. CSS variant.
 *
 * Copy-paste files: this file + SharedTypes.ts
 * Runtime deps: react
 *
 * Usage: <ModalDismissToastSlideLeft duration={5000} onDismiss={remove}><YourToast /></ModalDismissToastSlideLeft>
 */

import { memo, useEffect, useRef } from 'react'

import { ToastPlaceholder } from '../MockToastContent'
import type { AutoDismissProps } from '../SharedTypes'

const DEFAULT_DURATION = 3800

function ModalDismissToastSlideLeftComponent({
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
    const entryDuration = reducedMotion ? 10 : 320
    const exitDuration = reducedMotion ? 10 : 240
    const easing = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

    el.animate(
      [
        { transform: 'translate3d(-140%, 0, 0) scale(0.96)', opacity: '0' },
        { transform: 'translate3d(8%, 0, 0) scale(1.02)', opacity: '1', offset: 0.7 },
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
      ],
      { duration: entryDuration, easing, fill: 'forwards' }
    )

    const exitTimer = setTimeout(() => {
      const exitAnim = el.animate(
        [
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
          { transform: 'translate3d(-8%, 0, 0) scale(0.98)', opacity: '0.9', offset: 0.5 },
          { transform: 'translate3d(-160%, 0, 0) scale(0.9)', opacity: '0' },
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
      data-animation-id="modal-dismiss__toast-slide-left"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        ref={wrapperRef}
        className={className}
        style={{ ...style, opacity: 0, transform: 'translate3d(-140%, 0, 0) scale(0.96)' }}
      >
        <ToastPlaceholder duration={duration}>{children}</ToastPlaceholder>
      </div>
    </div>
  )
}

export const ModalDismissToastSlideLeft = memo(ModalDismissToastSlideLeftComponent)
