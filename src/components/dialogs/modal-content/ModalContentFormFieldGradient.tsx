import { motion, useReducedMotion } from 'framer-motion'
import type { AnimationMetadata } from '../../../types/animation'
import './ModalContentFormFieldGradient.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'modal-content__form-field-gradient',
  title: 'Form Gradient Sweep',
  description: 'Gradient sweep across 3 fields emphasising focus and order.',
  tags: ['framer']
}

export function ModalContentFormFieldGradient() {
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
            <div className="modal-content-form">
              <div className="modal-content-field">
                <label>Field 1</label>
                <input type="text" defaultValue="Input" />
              </div>
              <div className="modal-content-field">
                <label>Field 2</label>
                <input type="text" defaultValue="Input" />
              </div>
              <div className="modal-content-field">
                <label>Field 3</label>
                <input type="text" defaultValue="Input" />
              </div>
            </div>
          </div>
          <div className="modal-content-footer">
            <button className="modal-content-button modal-content-button-primary">Accept</button>
            <button className="modal-content-button modal-content-button-secondary">Later</button>
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
          <div className="modal-content-form">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="modal-content-field"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: [20, 0, 0],
                  opacity: [0, 1, 1],
                  background: [
                    'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%)',
                    'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)',
                    'transparent'
                  ]
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + 0.12 * index,
                  ease: [0.4, 0, 0.2, 1],
                  times: [0, 0.5, 1]
                }}
              >
                <label>Field {index + 1}</label>
                <input type="text" defaultValue="Input" />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="modal-content-footer">
          <motion.button
            className="modal-content-button modal-content-button-primary"
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{
              y: [16, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.3,
              delay: 0.75,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.6, 1]
            }}
          >
            Accept
          </motion.button>
          <motion.button
            className="modal-content-button modal-content-button-secondary"
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{
              y: [16, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.3,
              delay: 0.82,
              ease: [0.4, 0, 0.2, 1],
              times: [0, 0.6, 1]
            }}
          >
            Later
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
