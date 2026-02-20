import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import { overlayStyles } from '@/motion/primitives'

export function ModalBaseSlideUpSoft() {
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__slide-up-soft"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ y: 64, scale: 0.92, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
