import * as m from 'motion/react-m'

import '../shared.css'
import './ModalContentButtonsStagger2.css'

export function ModalContentButtonsStagger2() {
  return (
    <div className="modal-content-overlay">
      <m.div
        className="modal-content-modal"
        initial={{ scale: 0.88, y: -16, opacity: 0 }}
        animate={{
          scale: [0.88, 1.02, 1],
          y: [-16, -4, 0],
          opacity: [0, 0.6, 1]
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1] as const,
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
          <m.button
            className="modal-content-button modal-content-button-primary"
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{
              y: [16, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.3,
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1] as const,
              times: [0, 0.6, 1]
            }}
          >
            Primary
          </m.button>
          <m.button
            className="modal-content-button modal-content-button-secondary"
            initial={{ y: 16, scale: 0.94, opacity: 0 }}
            animate={{
              y: [16, -6, 0],
              scale: [0.94, 1.06, 1],
              opacity: [0, 1, 1]
            }}
            transition={{
              duration: 0.3,
              delay: 0.37,
              ease: [0.4, 0, 0.2, 1] as const,
              times: [0, 0.6, 1]
            }}
          >
            Secondary
          </m.button>
        </div>
      </m.div>
    </div>
  )
}
