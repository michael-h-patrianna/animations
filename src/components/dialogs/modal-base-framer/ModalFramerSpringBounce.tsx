import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export function ModalFramerSpringBounce() {
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  const modalVariants = {
    initial: { scale: 0.7, opacity: 0, y: -30 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 280, damping: 20, mass: 0.8 },
    },
  }

  return (
    <motion.div
      className="pf-modal-overlay"
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.72' } as CSSProperties}
      data-animation-id="modal-base-framer__spring-bounce"
    >
      <div className="pf-modal-center">
        <motion.div className="pf-modal pf-modal--spring" variants={modalVariants}>
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
