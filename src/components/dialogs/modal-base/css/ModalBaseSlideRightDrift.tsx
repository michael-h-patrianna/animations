import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideRightDrift.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__slide-right-drift',
  title: 'Slide Right Drift',
  description: 'Slides in from the left by 68px with 68% overlay fade and soft blur 7px.',
  tags: ['css'],
}

export function ModalBaseSlideRightDrift() {
  return (
    <div
      className="pf-modal-overlay modal-base-slide-right-drift-overlay"
      data-animation-id="modal-base__slide-right-drift"
    >
      <div className="pf-modal-center">
        <div className="pf-modal modal-base-slide-right-drift-modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
