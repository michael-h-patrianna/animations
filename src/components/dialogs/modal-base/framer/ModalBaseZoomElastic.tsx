import { overlayStyles } from '@/motion/primitives'
import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'

/**
 *
 */
export function ModalBaseZoomElastic() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.72, ease: [0.68, -0.55, 0.265, 1.55] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__zoom-elastic"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.15, 0.95, 1.05, 1], opacity: [0, 1, 1, 1, 1] }}
          transition={{ duration: 0.72, ease: [0.68, -0.55, 0.265, 1.55] }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
