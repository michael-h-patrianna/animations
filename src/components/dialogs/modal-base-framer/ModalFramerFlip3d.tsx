import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export function ModalFramerFlip3d() {
  const duration = 0.8
  const ease = [0.175, 0.885, 0.32, 1] as const
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.76' } as CSSProperties}
      data-animation-id="modal-base-framer__flip-3d"
    >
      <div className="pf-modal-center pf-perspective">
        <motion.div
          className="pf-modal"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ rotateY: 180, scale: 0.65, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          transition={{ duration, ease }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
