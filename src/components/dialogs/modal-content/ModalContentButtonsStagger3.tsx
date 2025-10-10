import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '../../../types/animation'
import './ModalContentButtonsStagger3.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'modal-content__buttons-stagger-3',
  title: 'Button Stagger ×3',
  description: 'Button cluster stagger with 3 actions.',
  tags: ['framer']
}

export function ModalContentButtonsStagger3() {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="modal-content-overlay">
        <div className="modal-content-modal">
          <div className="modal-content-header">
            <h4 className="modal-content-title">Sequence Control</h4>
            <span className="modal-content-badge">Modal</span>
          </div>
          <div className="modal-content-body">
            <p>Build trust by sequencing content reveals.</p>
            <p>Keep focus with 70ms cadence.</p>
          </div>
          <div className="modal-content-footer">
            <button className="modal-content-button modal-content-button-primary">Primary</button>
            <button className="modal-content-button modal-content-button-secondary">Secondary</button>
            <button className="modal-content-button modal-content-button-secondary">Tertiary</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-content-overlay">
      <motion.div
        className="modal-content-modal"
        initial={{ scale: 0.88, y: -16, opacity: 0 }}
        animate={{
          scale: [0.88, 1.02, 1],
          y: [-16, -4, 0],
          opacity: [0, 0.6, 1]
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          times: [0, 0.5, 1]
        }}
      >
        <div className="modal-content-header">
          <h4 className="modal-content-title">Sequence Control</h4>
          <span className="modal-content-badge">Modal</span>
        </div>
        <div className="modal-content-body">
          <p>Build trust by sequencing content reveals.</p>
          <p>Keep focus with 70ms cadence.</p>
        </div>
        <div className="modal-content-footer">
          <motion.button
            className="modal-content-button modal-content-button-primary"
            initial={{ y: 20, scale: 0.94, opacity: 0 }}
            animate={{
              y: [20, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.32,
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.6, 1]
            }}
          >
            Primary
          </motion.button>
          <motion.button
            className="modal-content-button modal-content-button-secondary"
            initial={{ y: 20, scale: 0.94, opacity: 0 }}
            animate={{
              y: [20, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.32,
              delay: 0.37,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.6, 1]
            }}
          >
            Secondary
          </motion.button>
          <motion.button
            className="modal-content-button modal-content-button-secondary"
            initial={{ y: 20, scale: 0.94, opacity: 0 }}
            animate={{
              y: [20, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.32,
              delay: 0.44,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.6, 1]
            }}
          >
            Tertiary
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
