import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export function ModalFramerScaleGentlePop() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.72' } as CSSProperties}
      data-animation-id="modal-base-framer__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: { duration: 0.42, ease: [0.12, 0.75, 0.4, 1] },
          }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
