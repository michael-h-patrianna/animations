import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '@/types/animation'
import { MockContent } from '../MockContent'
import '../shared.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'modal-dismiss__toast-slide-right',
  title: 'Toast Slide Right',
  description: 'Toast slides along the horizontal axis with auto-dismiss at 3800ms.',
  tags: ['framer'],
}

export function ModalDismissToastSlideRight() {
  const shouldReduceMotion = useReducedMotion()
  const [showProgress, setShowProgress] = useState(true)
  const toastRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const entryDuration = 0.32
  const autoDismissMs = 3800
  const exitDuration = 0.36

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setShowProgress(false)
    }, autoDismissMs)

    return () => clearTimeout(exitTimer)
  }, [autoDismissMs])

  if (shouldReduceMotion) {
    return <MockContent toastRef={toastRef} progressRef={progressRef} animationId="modal-dismiss__toast-slide-right" />
  }

  const toastVariants = {
    hidden: {
      x: '140%',
      scale: 0.96,
      opacity: 0,
    },
    visible: {
      x: ['140%', '-6%', '0%'],
      scale: [0.96, 1.02, 1],
      opacity: [0, 1, 1],
      transition: {
        duration: entryDuration,
        times: [0, 0.7, 1],
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      x: ['0%', '8%', '160%'],
      scale: [1, 0.98, 0.9],
      opacity: [1, 0.9, 0],
      transition: {
        duration: exitDuration,
        times: [0, 0.5, 1],
        ease: [0.4, 0, 0.2, 1] as const,
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
        data-animation-id="modal-dismiss__toast-slide-right"
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
