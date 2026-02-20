import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseTvTurnOn() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__tv-turn-on"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ scaleX: 2, scaleY: 0, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
