import { useEffect, useRef } from 'react'
import { MockContent } from './MockContent'

function runAnimation(toast: HTMLDivElement, progress: HTMLDivElement) {
  toast.style.opacity = '0'
  toast.style.transform = 'translate3d(0, 16px, 0) scale(0.84)'
  progress.style.transform = 'scaleX(1)'

  const entryDuration = 320
  const autoDismissMs = 4000
  const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)))

  const enterKeyframes = [
    { transform: 'translate3d(0, 16px, 0) scale(0.84)', opacity: '0' },
    { transform: 'translate3d(0, -6px, 0) scale(1.08)', opacity: '1', offset: 0.6 },
    { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
  ]

  toast.animate(enterKeyframes, {
    duration: entryDuration,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    fill: 'forwards',
  })

  progress.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
    duration: autoDismissMs,
    easing: 'linear',
    fill: 'forwards',
  })

  toast.animate(
    [
      { transform: 'translate3d(0,0,0) scale(1)', filter: 'brightness(1)', opacity: '1' },
      { transform: 'translate3d(0,-4px,0) scale(1.05)', filter: 'brightness(1.12)', opacity: '1', offset: 0.18 },
      { transform: 'translate3d(0,6px,0) scale(0.96)', filter: 'brightness(0.95)', opacity: '0.92', offset: 0.55 },
      { transform: 'translate3d(0,12px,0) scale(0.9)', filter: 'brightness(0.88)', opacity: '0.85' },
    ],
    { duration: autoDismissMs, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
  )

  const exitTimer = setTimeout(() => {
    toast.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
        { transform: 'translate3d(0, 6px, 0) scale(0.92)', opacity: '0.4', offset: 0.6 },
        { transform: 'translate3d(0, 16px, 0) scale(0.8)', opacity: '0' },
      ],
      { duration: exitDuration, easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', fill: 'forwards' }
    )
  }, autoDismissMs)

  return () => {
    clearTimeout(exitTimer)
    toast.getAnimations().forEach((anim) => anim.cancel())
    progress.getAnimations().forEach((anim) => anim.cancel())
  }
}

/**
 *
 */
export function ModalDismissSnackbarScale() {
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const toast = toastRef.current
    const progress = progressRef.current
    if (!toast || !progress) return
    return runAnimation(toast, progress)
  }, [])

  return (
    <div data-animation-id="modal-dismiss__snackbar-scale">
      <MockContent toastRef={toastRef} progressRef={progressRef} animationId="modal-dismiss__snackbar-scale" />
    </div>
  )
}
