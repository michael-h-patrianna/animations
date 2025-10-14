import { motion } from 'framer-motion'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseUnfoldOrigami() {
  const duration = 0.9
  const ease = [0.25, 0.46, 0.45, 0.94] as const
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__unfold-origami"
    >
      <div className="pf-modal-center pf-perspective">
        <motion.div
          className="pf-modal"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateX: -180, scale: 0, opacity: 0 }}
          animate={{ rotateX: 0, scale: 1, opacity: 1 }}
          transition={{ duration, ease }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
