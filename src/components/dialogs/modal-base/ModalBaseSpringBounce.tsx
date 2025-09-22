import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import './ModalBaseSpringBounce.css'

export function ModalBaseSpringBounce() {
  const overlayVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const modalVariants = {
    initial: {
      scale: 0.7,
      opacity: 0,
      y: -30,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 280,
        damping: 20,
        mass: 0.8,
      },
    },
  }

  return (
    <motion.div
      className="pf-modal-overlay"
      variants={overlayVariants}
      initial="initial"
      animate="animate"
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.72' } as CSSProperties}
      data-animation-id="modal-base__spring-bounce"
    >
      <div className="pf-modal-center">
        <motion.div className="pf-modal pf-modal--spring" variants={modalVariants}>
          <div className="pf-modal__header">
            <h3 className="pf-modal__title">Spring Entrance</h3>
            <span className="pf-badge-tech">Modal</span>
          </div>
          <div className="pf-modal__body">
            <p>Elastic spring animation with natural bounce physics.</p>
          </div>
          <div className="pf-modal__footer">
            <button className="pf-button-primary">Accept</button>
            <button className="pf-button-secondary">Later</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
