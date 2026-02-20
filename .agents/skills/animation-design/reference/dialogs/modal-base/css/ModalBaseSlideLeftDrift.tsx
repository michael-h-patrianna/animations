import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideLeftDrift.css'


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

