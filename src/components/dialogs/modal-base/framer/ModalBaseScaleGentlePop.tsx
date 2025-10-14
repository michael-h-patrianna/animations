import { motion } from 'framer-motion'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseScaleGentlePop() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.12, 0.75, 0.4, 1] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__scale-gentle-pop"
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
