import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseScaleGentlePop.css'


export function ModalBaseScaleGentlePop() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--scale-gentle-pop"
      data-animation-id="modal-base__scale-gentle-pop"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--scale-gentle-pop">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}

