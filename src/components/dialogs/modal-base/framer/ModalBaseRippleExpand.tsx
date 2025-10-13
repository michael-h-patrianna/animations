import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'

export function ModalBaseRippleExpand() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base__ripple-expand"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.05, 0.98, 1],
            opacity: [0, 0.8, 1, 1],
          }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
