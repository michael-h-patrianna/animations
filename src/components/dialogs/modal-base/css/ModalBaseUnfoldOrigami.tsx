import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseUnfoldOrigami.css'

export function ModalBaseUnfoldOrigami() {
  return (
    <div className="modal-base-unfold-origami" data-animation-id="modal-base__unfold-origami">
      <div className="modal-base-unfold-origami__center">
        <div className="modal-base-unfold-origami__modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}

