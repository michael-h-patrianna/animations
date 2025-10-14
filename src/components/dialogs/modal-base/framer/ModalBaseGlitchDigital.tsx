import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseGlitchDigital() {
  const duration = 0.6
  const ease = 'easeInOut'
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__glitch-digital"
    >
      <div className="pf-modal-center">
        {/* Ghost layers behind the modal */}
        <m.div
          className="pf-modal pf-modal--ghost pf-modal--ghost-green"
          initial={{ x: 3, y: 2, opacity: 0.4 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{ duration, ease, delay: 0.05 }}
        />
        <m.div
          className="pf-modal pf-modal--ghost pf-modal--ghost-pink"
          initial={{ x: -2, y: -3, opacity: 0.3 }}
          animate={{ x: 0, y: 0, opacity: 0 }}
          transition={{ duration, ease, delay: 0.1 }}
        />
        <m.div
          className="pf-modal"
          initial={{ skewX: 0, opacity: 0 }}
          animate={{ skewX: [0, 2, -2, 1, 0], opacity: [0, 0.5, 0.8, 0.95, 1] }}
          transition={{ duration, ease }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
