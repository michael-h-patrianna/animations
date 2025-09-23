import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export function ModalFramerGlitchDigital() {
  const duration = 0.6
  const ease = 'easeInOut'
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base-framer__glitch-digital"
    >
      <div className="pf-modal-center">
        {/* Ghost layers behind the modal */}
        <motion.div
          className="pf-modal pf-modal--ghost pf-modal--ghost-green"
          initial={{ x: 3, y: 2, opacity: 0.4 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{ duration, ease, delay: 0.05 }}
        />
        <motion.div
          className="pf-modal pf-modal--ghost pf-modal--ghost-pink"
          initial={{ x: -2, y: -3, opacity: 0.3 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{ duration, ease, delay: 0.1 }}
        />
        <motion.div
          className="pf-modal"
          initial={{ skewX: 0, opacity: 0 }}
          animate={{ skewX: [0, 2, -2, 1, 0], opacity: [0, 0.5, 0.8, 0.95, 1] }}
          transition={{ duration, ease }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
