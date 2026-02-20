import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'

/**
 *
 */
export function ModalDismissSnackbarScale() {
const [showProgress, setShowProgress] = useState(true)

  const entryDuration = 0.32
  const autoDismissMs = 4000
  const exitDuration = 0.36

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setShowProgress(false)
    }, autoDismissMs)

    return () => clearTimeout(exitTimer)
  }, [autoDismissMs])
  const toastVariants = {
    hidden: {
      y: 16,
      scale: 0.84,
      opacity: 0,
    },
    visible: {
      y: [16, -6, 0],
      scale: [0.84, 1.08, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: entryDuration,
        times: [0, 0.6, 1],
        ease: [0.68, -0.55, 0.265, 1.55] as const,
      },
    },
    pulse: {
      y: [0, -4, 6, 12],
      scale: [1, 1.05, 0.96, 0.9],
      opacity: [1, 1, 0.92, 0.85],
      transition: {
        duration: autoDismissMs / 1000,
        times: [0, 0.18, 0.55, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      y: [0, 6, 16],
      scale: [1, 0.92, 0.8],
      opacity: [1, 0.4, 0],
      transition: {
        duration: exitDuration,
        times: [0, 0.6, 1],
        ease: [0.68, -0.55, 0.265, 1.55] as const,
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
      <m.div
        className="pf-toast"
        data-animation-id="modal-dismiss__snackbar-scale"
        variants={toastVariants}
        initial="hidden"
        animate={showProgress ? ['visible', 'pulse'] : 'exit'}
      >
        <div className="pf-toast__title">Action Complete</div>
        <div className="pf-toast__body">Your changes have been saved</div>
        <div className="pf-toast__progress">
          <m.div
            className="pf-toast__progress-bar"
            variants={progressVariants}
            initial="full"
            animate="empty"
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </m.div>
    </div>
  )
}
