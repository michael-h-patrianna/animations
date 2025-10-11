import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import '../shared.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'modal-dismiss__toast-drop',
  title: 'Toast Drop Down',
  description: 'Toast slides along the vertical axis with auto-dismiss at 3600ms.',
  tags: ['framer'],
}

export function ModalDismissToastDrop() {
const [showProgress, setShowProgress] = useState(true)

  const entryDuration = 0.42
  const autoDismissMs = 3600
  const exitDuration = 0.36

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setShowProgress(false)
    }, autoDismissMs)

    return () => clearTimeout(exitTimer)
  }, [autoDismissMs])
  const toastVariants = {
    hidden: {
      y: '-120%',
      scale: 0.96,
      opacity: 0,
    },
    visible: {
      y: ['-120%', '10%', '0%'],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: entryDuration,
        times: [0, 0.7, 1],
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      y: ['0%', '-12%', '120%'],
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
      <motion.div
        className="pf-toast"
        data-animation-id="modal-dismiss__toast-drop"
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
