import * as m from 'motion/react-m'

import { useEffect, useRef, useState } from 'react'

/**
 *
 */
export function ModalDismissToastRaise() {
  const [showProgress, setShowProgress] = useState(true)
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const entryDuration = 0.42
  const autoDismissMs = 3600
  const exitDuration = Math.min(0.36, Math.max(0.22, Math.round(entryDuration * 750) / 1000))

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setShowProgress(false)
    }, autoDismissMs)

    return () => clearTimeout(exitTimer)
  }, [autoDismissMs])
  const toastVariants = {
    hidden: {
      y: '120%',
      scale: 0.96,
      opacity: 0,
    },
    visible: {
      y: ['120%', '-8%', '0%'],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: entryDuration,
        times: [0, 0.7, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      y: ['0%', '12%', '-120%'],
      scale: [1, 0.98, 0.9],
      opacity: [1, 0.9, 0],
      transition: {
        duration: exitDuration,
        times: [0, 0.5, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const progressVariants = {
    full: { scaleX: 1 },
    empty: {
      scaleX: 0,
      transition: {
        duration: autoDismissMs / 1000,
        ease: 'linear' as const,
      },
    },
  }

  return (
    <div className="pf-toast-preview">
      <m.div ref={toastRef} className="pf-toast" data-animation-id="modal-dismiss__toast-raise" variants={toastVariants} initial="hidden" animate={showProgress ? 'visible' : 'exit'}>
        <div className="pf-toast__title">Action Complete</div>
        <div className="pf-toast__body">Your changes have been saved</div>
        <div className="pf-toast__progress">
          <m.div ref={progressRef} className="pf-toast__progress-bar" variants={progressVariants} initial="full" animate="empty" style={{ transformOrigin: 'left center' }} />
        </div>
      </m.div>
    </div>
  )
}
