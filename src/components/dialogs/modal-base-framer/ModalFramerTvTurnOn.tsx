import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export function ModalFramerTvTurnOn() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base-framer__tv-turn-on"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ scaleX: 2, scaleY: 0, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
