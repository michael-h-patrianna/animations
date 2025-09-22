import { useEffect, useRef } from 'react'
import './ModalDismissSnackbarWipe.css'

export function ModalDismissSnackbarWipe() {
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  // Removed unused state

  useEffect(() => {
    const toast = toastRef.current
    const progress = progressRef.current
    if (!toast || !progress) return

    // Set initial state
    toast.style.opacity = '0'
    toast.style.transform = 'translate3d(0, 24px, 0) scale(0.96)'
    toast.style.clipPath = 'inset(0 0 0 100%)'
    progress.style.transform = 'scaleX(1)'

    const entryDuration = 420
    const autoDismissMs = 4200
    const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)))

    // Entrance animation (wipe effect with clipPath)
    const enterKeyframes = [
      {
        transform: 'translate3d(0, 24px, 0) scale(0.96)',
        opacity: '0',
        clipPath: 'inset(0 0 0 100%)',
      },
      {
        transform: 'translate3d(0, -4px, 0) scale(1.02)',
        opacity: '1',
        clipPath: 'inset(0 0 0 0)',
        offset: 0.7,
      },
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1', clipPath: 'inset(0 0 0 0)' },
    ]

    const enterAnimation = toast.animate(enterKeyframes, {
      duration: entryDuration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // entrance easing
      fill: 'forwards',
    })

    // Progress bar animation (scaleX from 1 to 0)
    progress.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
      duration: autoDismissMs,
      easing: 'linear',
      fill: 'forwards',
    })

    // Schedule exit animation
    const exitTimer = setTimeout(() => {
      const exitKeyframes = [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1', clipPath: 'inset(0 0 0 0)' },
        {
          transform: 'translate3d(0, 6px, 0) scale(0.96)',
          opacity: '0.6',
          clipPath: 'inset(0 0 0 0)',
          offset: 0.55,
        },
        {
          transform: 'translate3d(0, 0, 0) scale(0.96)',
          opacity: '0',
          clipPath: 'inset(0 0 0 100%)',
        },
      ]

      toast.animate(exitKeyframes, {
        duration: exitDuration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      })
    }, autoDismissMs)

    // Clean up clipPath after enter animation completes
    enterAnimation.addEventListener(
      'finish',
      () => {
        toast.style.clipPath = 'inset(0 0 0 0)'
      },
      { once: true }
    )

    return () => {
      clearTimeout(exitTimer)
      toast.getAnimations().forEach((anim) => anim.cancel())
      progress.getAnimations().forEach((anim) => anim.cancel())
    }
  }, [])

  return (
    <div className="pf-toast-preview">
      <div ref={toastRef} className="pf-toast" data-animation-id="modal-dismiss__snackbar-wipe">
        <div className="pf-toast__title">Action Complete</div>
        <div className="pf-toast__body">Your changes have been saved</div>
        <div className="pf-toast__progress">
          <div ref={progressRef} className="pf-toast__progress-bar"></div>
        </div>
      </div>
    </div>
  )
}
