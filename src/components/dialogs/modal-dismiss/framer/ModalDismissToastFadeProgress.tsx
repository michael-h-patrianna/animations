import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import '../shared.css'

export function ModalDismissToastFadeProgress() {
const [showProgress, setShowProgress] = useState(true)

  const entryDuration = 0.42
  const autoDismissMs = 4600
  const exitDuration = 0.36

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setShowProgress(false)
    }, autoDismissMs)

    return () => clearTimeout(exitTimer)
  }, [autoDismissMs])
  const toastVariants = {
    hidden: {
      y: 18,
      scale: 0.94,
      opacity: 0,
    },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: entryDuration,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      y: [0, 12, 24],
      scale: [1, 0.92, 0.88],
      opacity: [1, 0.4, 0],
      transition: {
        duration: exitDuration,
        times: [0, 0.6, 1],
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
      <motion.div
        className="pf-toast"
        data-animation-id="modal-dismiss__toast-fade-progress"
        variants={toastVariants}
        initial="hidden"
        animate={showProgress ? 'visible' : 'exit'}
      >
        <div className="pf-toast__title">Action Complete</div>
        <div className="pf-toast__body">Your changes have been saved</div>
        <div className="pf-toast__progress">
          <motion.div
            className="pf-toast__progress-bar"
            variants={progressVariants}
            initial="full"
            animate="empty"
            style={{ transformOrigin: 'left center' }}
          />
        </div>
      </motion.div>
    </div>
  )
}
