import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base-framer__slide-right-drift',
  title: 'Slide Right Drift',
  description: 'Slides in from the left by 68px with 68% overlay fade and soft blur 7px.',
  tags: ['framer'],
}

export function ModalFramerSlideRightDrift() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base-framer__slide-right-drift"
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
