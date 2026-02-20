import { useState, useEffect } from 'react'
import * as m from 'motion/react-m'


export function ModalDismissSnackbarWipe() {
const [showProgress, setShowProgress] = useState(true)

  const entryDuration = 0.42
  const autoDismissMs = 4200
  const exitDuration = 0.36

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setShowProgress(false)
    }, autoDismissMs)

    return () => clearTimeout(exitTimer)
  }, [autoDismissMs])
  const toastVariants = {
    hidden: {
      y: 24,
      scale: 0.96,
      opacity: 0,
      clipPath: 'inset(0 0 0 100%)',
    },
    visible: {
      y: [24, -4, 0],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      clipPath: ['inset(0 0 0 100%)', 'inset(0 0 0 0)', 'inset(0 0 0 0)'],
      transition: {
        duration: entryDuration,
        times: [0, 0.7, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      y: [0, 6, 0],
      scale: [1, 0.96, 0.96],
      opacity: [1, 0.6, 0],
      clipPath: ['inset(0 0 0 0)', 'inset(0 0 0 0)', 'inset(0 0 0 100%)'],
      transition: {
        duration: exitDuration,
        times: [0, 0.55, 1],
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
      <m.div
        className="pf-toast"
        data-animation-id="modal-dismiss__snackbar-wipe"
        variants={toastVariants}
        initial="hidden"
        animate={showProgress ? 'visible' : 'exit'}
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
