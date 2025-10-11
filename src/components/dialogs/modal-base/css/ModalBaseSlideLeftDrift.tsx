import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideLeftDrift.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__slide-left-drift',
  title: 'Slide Left Drift',
  description: 'Slides in from the right by 68px with 68% overlay fade and soft scale.',
  tags: ['css'],
}

export function ModalBaseSlideLeftDrift() {
  return (
    <div
      className="pf-modal-overlay modal-base-slide-left-drift-overlay"
      data-animation-id="modal-base__slide-left-drift"
    >
      <div className="pf-modal-center">
        <div className="pf-modal modal-base-slide-left-drift-modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
