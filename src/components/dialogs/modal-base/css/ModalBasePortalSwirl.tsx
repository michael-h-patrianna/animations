import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBasePortalSwirl.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__portal-swirl',
  title: 'Portal Swirl',
  description: 'Fantasy game vortex entrance with spiral rotation and morphing border radius.',
  tags: ['css'],
}

export function ModalBasePortalSwirl() {
  return (
    <div
      className="pf-modal-portal-swirl-overlay"
      data-animation-id="modal-base__portal-swirl"
    >
      <div className="pf-modal-portal-swirl-center">
        <div className="pf-modal-portal-swirl">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
