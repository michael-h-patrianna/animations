import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export function ModalFramerShatterAssemble() {
  const duration = 0.85
  const ease = [0.68, -0.55, 0.265, 1.55] as const
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: 'linear' }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base-framer__shatter-assemble"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
          animate={{
            rotate: [0, 5, -5, 2, 0],
            x: [0, -5, 5, -2, 0],
            y: [0, -5, -5, -2, 0],
            opacity: [0, 0.3, 0.6, 0.9, 1],
          }}
          transition={{ duration, ease }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
