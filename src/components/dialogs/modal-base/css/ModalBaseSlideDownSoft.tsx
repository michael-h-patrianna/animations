import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideDownSoft.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__slide-down-soft',
  title: 'Slide Down Welcome',
  description: 'Slides in from the top by 60px with 68% overlay fade and gentle scale.',
  tags: ['css'],
}

export function ModalBaseSlideDownSoft() {
  return (
    <div
      className="pf-modal-overlay modal-base-slide-down-soft-overlay"
      data-animation-id="modal-base__slide-down-soft"
    >
      <div className="pf-modal-center">
        <div className="pf-modal modal-base-slide-down-soft-modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
