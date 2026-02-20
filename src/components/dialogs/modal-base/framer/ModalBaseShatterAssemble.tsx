import * as m from 'motion/react-m'

import { MockModalContent } from '../MockModalContent'
import { overlayStyles } from '@/motion/primitives'

/**
 *
 */
export function ModalBaseShatterAssemble() {
  const duration = 0.85
  const ease = [0.68, -0.55, 0.265, 1.55] as const
  return (
    <m.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, ease: 'linear' as const }}
      style={overlayStyles.standard}
      data-animation-id="modal-base__shatter-assemble"
    >
      <div className="pf-modal-center">
        <m.div
          className="pf-modal"
          initial={{ rotate: 0, x: 0, y: 0, opacity: 0 }}
          animate={{
            rotate: [0, 5, -5, 2, 0],
            x: [0, -5, 5, -2, 0],
            y: [0, -5, -5, -2, 0],
            opacity: [0, 0.3, 0.6, 0.9, 1],
          }}
          transition={{ duration, ease }}
        >
          <MockModalContent />
        </m.div>
      </div>
    </m.div>
  )
}
