import { motion } from 'framer-motion'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseSlideRightDrift() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__slide-right-drift"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ x: -68, scale: 0.93, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
