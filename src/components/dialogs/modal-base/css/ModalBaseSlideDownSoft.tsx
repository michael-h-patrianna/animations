import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideDownSoft.css'


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

