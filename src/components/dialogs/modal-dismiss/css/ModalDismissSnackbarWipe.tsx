import { useEffect, useRef } from 'react'
import { MockContent } from './MockContent'

function runAnimation(toast: HTMLDivElement, progress: HTMLDivElement) {
  toast.style.opacity = '0'
  toast.style.transform = 'translate3d(0, 24px, 0) scale(0.96)'
  toast.style.clipPath = 'inset(0 0 0 100%)'
  progress.style.transform = 'scaleX(1)'

  const entryDuration = 420
  const autoDismissMs = 4200
  const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)))

  const enterKeyframes = [
    { transform: 'translate3d(0, 24px, 0) scale(0.96)', opacity: '0', clipPath: 'inset(0 0 0 100%)' },
    { transform: 'translate3d(0, -4px, 0) scale(1.02)', opacity: '1', clipPath: 'inset(0 0 0 0)', offset: 0.7 },
    { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1', clipPath: 'inset(0 0 0 0)' },
  ]

  const enterAnimation = toast.animate(enterKeyframes, {
    duration: entryDuration,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards',
  })

  progress.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
    duration: autoDismissMs,
    easing: 'linear',
    fill: 'forwards',
  })

  const exitTimer = setTimeout(() => {
    toast.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1', clipPath: 'inset(0 0 0 0)' },
        { transform: 'translate3d(0, 6px, 0) scale(0.96)', opacity: '0.6', clipPath: 'inset(0 0 0 0)', offset: 0.55 },
        { transform: 'translate3d(0, 0, 0) scale(0.96)', opacity: '0', clipPath: 'inset(0 0 0 100%)' },
      ],
      { duration: exitDuration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', fill: 'forwards' }
    )
  }, autoDismissMs)

  enterAnimation.addEventListener('finish', () => { toast.style.clipPath = 'inset(0 0 0 0)' }, { once: true })

  return () => {
    clearTimeout(exitTimer)
    toast.getAnimations().forEach((anim) => anim.cancel())
    progress.getAnimations().forEach((anim) => anim.cancel())
  }
}

/**
 *
 */
export function ModalDismissSnackbarWipe() {
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const toast = toastRef.current
    const progress = progressRef.current
    if (!toast || !progress) return
    return runAnimation(toast, progress)
  }, [])

  return (
    <div data-animation-id="modal-dismiss__snackbar-wipe">
      <MockContent toastRef={toastRef} progressRef={progressRef} animationId="modal-dismiss__snackbar-wipe" />
    </div>
  )
}
