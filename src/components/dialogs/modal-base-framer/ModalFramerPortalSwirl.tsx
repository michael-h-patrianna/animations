import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../modal-base/MockModalContent'
import '../modal-base/shared.css'
import './framer-shared.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base-framer__portal-swirl',
  title: 'Portal Swirl',
  description: 'Fantasy game vortex entrance with spiral rotation and morphing border radius.',
  tags: ['framer'],
}

export function ModalFramerPortalSwirl() {
  return (
    <motion.div
      className="pf-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ ['--overlay-opacity' as unknown as keyof CSSProperties]: '0.68' } as CSSProperties}
      data-animation-id="modal-base-framer__portal-swirl"
    >
      <div className="pf-modal-center">
        <motion.div
          className="pf-modal"
          initial={{ rotate: 720, scale: 0, opacity: 0, borderRadius: '50%' }}
          animate={{ rotate: 0, scale: 1, opacity: 1, borderRadius: '12px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MockModalContent />
        </motion.div>
      </div>
    </motion.div>
  )
}
